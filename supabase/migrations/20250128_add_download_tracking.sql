-- Create download_tracking table
CREATE TABLE download_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES research_documents(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_email TEXT NOT NULL,
    user_metadata JSONB DEFAULT '{}'
);

-- Create indexes
CREATE INDEX idx_download_tracking_user_id ON download_tracking(user_id);
CREATE INDEX idx_download_tracking_document_id ON download_tracking(document_id);
CREATE INDEX idx_download_tracking_downloaded_at ON download_tracking(downloaded_at DESC);

-- Enable RLS
ALTER TABLE download_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own downloads" ON download_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert download records" ON download_tracking
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all downloads" ON download_tracking
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );

-- Create function to mark user as researcher
CREATE OR REPLACE FUNCTION mark_user_as_researcher()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user metadata to mark as researcher
    UPDATE auth.users
    SET raw_user_meta_data = 
        COALESCE(raw_user_meta_data, '{}'::jsonb) || 
        '{"is_researcher": true, "first_download_at": "' || NEW.downloaded_at || '"}'::jsonb
    WHERE id = NEW.user_id
    AND (raw_user_meta_data->>'is_researcher')::boolean IS DISTINCT FROM true;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-mark researchers
CREATE TRIGGER mark_researcher_on_download
    AFTER INSERT ON download_tracking
    FOR EACH ROW
    EXECUTE FUNCTION mark_user_as_researcher();

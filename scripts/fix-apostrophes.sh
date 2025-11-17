#!/bin/bash

# Fix all unescaped apostrophes and quotes in React TSX files

FILES=(
  "app/about/page.tsx"
  "app/page.tsx"
  "app/diagnostic/page.tsx"
  "app/research/theories/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Replace unescaped single quotes within JSX text content
    sed -i '' -E \
      -e "s/([^&])'/\1\&apos;/g" \
      -e "s/^'/\&apos;/g" \
      -e "s/([^&])\"([^=<>])/\1\&quot;\2/g" \
      "$file"
    echo "Fixed $file"
  fi
done

echo "All fixes complete!"


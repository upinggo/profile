'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './page.module.css';
import Navigation from "@/components/common/Navigation";
import { envFetch } from '@/utils/HelperUtils';

 // This is a placeholder - in a real app you would fetch from an actual markdown file
        // For example: const response = await fetch('/path/to/markdown/file.md');
        // const markdownText = await response.text();
        
        // Using sample markdown for demonstration purposes
        const sampleMarkdown = `
# Welcome to My Blog

This is a sample blog post demonstrating how markdown content will be rendered on this page.

## About This Blog

This blog features my thoughts and insights on various topics. Each post is written in markdown format and beautifully rendered for your reading pleasure.

## Sample Content

Here's an example of different markdown elements:

### Headers
Headers from H1 to H6 are supported and styled appropriately.

### Emphasis
You can make text *italic* or **bold** or ***both***.

### Lists

Unordered List:
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

Ordered List:
1. First item
2. Second item
   1. Nested ordered item
3. Third item

### Code

Inline \`code\` can be included like this.

\`\`\`javascript
// Example of a code block
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

### Links and Images

[Example Link](https://example.com)

![Example Image](https://placehold.co/600x400.png?text=Sample+Image)

### Blockquotes

> This is a blockquote
> It can span multiple lines
> And contain multiple paragraphs

### Horizontal Rule

---

That's a basic overview of the markdown rendering capabilities!
        `;

export default function Blog() {
  const [markdownContent, setMarkdownContent] = useState<string>(sampleMarkdown);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        // Try multiple possible paths for the markdown file
        // This handles both root domain and subdirectory deployments
        
        // First, try the direct path (works for root domains)
        let response = await envFetch('/Blog/README.md');
        
        // If that fails, it might be a subdirectory deployment (e.g., username.github.io/repo-name/)
        if (!response.ok) {
          // Construct path relative to the current location
          // This handles cases where the site is deployed to a subdirectory
          const pathParts = window.location.pathname.split('/');
          pathParts.pop(); // Remove the current page ('blog')
          const basePath = pathParts.join('/') || ''; // Join the remaining parts
          
          // Build the correct path to the asset
          const assetPath = `${basePath}/Blog/README.md`.replace('//', '/');
          response = await fetch(assetPath);
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch markdown: ${response.status} ${response.statusText}`);
        }
        
        const markdownText = await response.text();
        setMarkdownContent(markdownText);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blog content');
        setLoading(false);
        console.error(err);
      }
    };

    fetchMarkdown();
  }, []);

  return (
    <div className={styles.blogContainer}>
      <Navigation path="/">
        <button className={styles.backButton}>← Back to Home</button>
      </Navigation>
      
      <header className={styles.blogHeader}>
        <h1 className={styles.blogTitle}>My Blog</h1>
        <p className={styles.blogSubtitle}>Thoughts, stories and ideas</p>
      </header>
      
      <main className={styles.markdownContent}>
        {loading ? (
          <p>Loading blog content...</p>
        ) : error ? (
          <p className={styles.noMarkdownMessage}>{error}</p>
        ) : markdownContent ? (
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        ) : (
          <p className={styles.noMarkdownMessage}>No blog content available</p>
        )}
      </main>
    </div>
  );
}
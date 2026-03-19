module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: '.*/projects/[^/]+/.*',
          assertions: {
            'categories:performance': ['warn', { minScore: 0.7 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],
          },
        },
        {
          matchingUrlPattern: '(?!.*/projects/[^/]+/).*',
          assertions: {
            'categories:performance': ['error', { minScore: 0.95 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],
          },
        },
      ],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

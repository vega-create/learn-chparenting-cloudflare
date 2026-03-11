interface ToolStructuredDataProps {
  name: string;
  description: string;
  url: string;
  educationalLevel: string;
  subject: string;
}

export function ToolStructuredData({ name, description, url, educationalLevel, subject }: ToolStructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: 'learn.chparenting.com',
      url: 'https://learn.chparenting.com',
    },
    educationalLevel,
    about: {
      '@type': 'Thing',
      name: subject,
    },
    isAccessibleForFree: true,
    inLanguage: 'zh-TW',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

import EditorLayout from '@/components/editor/EditorLayout';

interface EditorPageProps {
  searchParams: Promise<{ sample?: string }>;
}

export default async function EditorPage({ searchParams }: EditorPageProps) {
  const params = await searchParams;
  return <EditorLayout sampleId={params.sample} />;
}

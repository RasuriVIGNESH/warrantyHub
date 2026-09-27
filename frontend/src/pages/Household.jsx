import { Users } from 'lucide-react';
import { Card } from '../components/ui/Card';


export function Household() {
  return (
      <div className="min-h-screen bg-slate-50 px-4 py-5 transition-colors duration-300 dark:bg-slate-900 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <Card className="border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-600 dark:bg-slate-800">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-slate-950 dark:text-slate-100">
              Household sharing is coming soon
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Invite members and share warranty records with your household. This feature is being built.
            </p>
          </Card>
        </div>
      </div>
  );
}
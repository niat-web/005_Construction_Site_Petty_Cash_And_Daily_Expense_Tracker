import type { Site } from '../../api/siteApi';
import { formatCurrency } from '../../utils/formatCurrency';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

interface SiteTableProps {
  sites: Site[];
  onDelete?: (id: number) => void;
}

export default function SiteTable({ sites, onDelete }: SiteTableProps) {
  if (!sites.length) {
    return <EmptyState title="No sites yet" description="Create your first construction site." />;
  }

  return (
    <div className="table-container fade-in">
      <table className="table">
        <thead>
          <tr>
            <th>Site Code</th>
            <th>Site Name</th>
            <th>Project ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site.id}>
              <td>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{site.site_code}</span>
              </td>
              <td className="font-medium text-slate-800">{site.site_name}</td>
              <td className="text-slate-500">#{site.project_id}</td>
              <td>
                <div className="flex gap-2">
                  <Link to={`/admin/sites/${site.id}`}>
                    <Button variant="outline" className="text-xs px-2 py-1">View</Button>
                  </Link>
                  {onDelete && (
                    <Button variant="danger" onClick={() => onDelete(site.id)} className="text-xs px-2 py-1">
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

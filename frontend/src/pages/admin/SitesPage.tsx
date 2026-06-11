import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchSitesThunk, createSiteThunk, deleteSiteThunk } from '../../features/sites/siteThunks';
import { fetchProjects } from '../../features/sites/projectSlice';
import PageHeader from '../../components/common/PageHeader';
import SiteTable from '../../components/sites/SiteTable';
import SiteForm from '../../components/sites/SiteForm';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { ConfirmDeleteModal } from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

export default function AdminSitesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sites, loading } = useSelector((s: RootState) => s.sites);
  const { projects } = useSelector((s: RootState) => s.projects);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => { 
    dispatch(fetchSitesThunk()); 
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreate = async (data: { project_id: number; site_name: string; site_code: string }) => {
    setCreating(true);
    await dispatch(createSiteThunk(data));
    setCreating(false);
    setShowCreateModal(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await dispatch(deleteSiteThunk(deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="Construction Sites"
        subtitle="Manage all active project sites"
        action={<Button variant="primary" onClick={() => setShowCreateModal(true)}>+ New Site</Button>}
      />

      {loading ? <Loader /> : <SiteTable sites={sites} onDelete={setDeleteId} />}

      {/* Create Site Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Site" size="md">
        <SiteForm projects={projects} onSubmit={handleCreate} loading={creating} />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        itemName="this site"
      />
    </div>
  );
}

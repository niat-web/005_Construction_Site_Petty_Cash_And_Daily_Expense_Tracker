import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchProjects, createProject, deleteProject } from '../../features/sites/projectSlice';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading } = useSelector((s: RootState) => s.projects);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ project_name: '', monthly_budget: '' });

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.project_name && form.monthly_budget) {
      await dispatch(createProject({
        project_name: form.project_name,
        monthly_budget: Number(form.monthly_budget)
      }));
      setShowModal(false);
      setForm({ project_name: '', monthly_budget: '' });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this project?")) {
      dispatch(deleteProject(id));
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="Projects"
        subtitle="Manage construction projects"
        action={<Button variant="primary" onClick={() => setShowModal(true)}>+ New Project</Button>}
      />

      {loading ? <Loader /> : (
        !projects.length ? (
          <EmptyState title="No projects found" description="Create a project to get started." />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project Name</th>
                  <th>Monthly Budget</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td className="font-semibold text-slate-800">{p.project_name}</td>
                    <td>{formatCurrency(p.monthly_budget)}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleDelete(p.id)} className="text-xs px-2 py-1">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Project">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Project Name" 
            value={form.project_name} 
            onChange={(e) => setForm(f => ({ ...f, project_name: e.target.value }))} 
            required 
          />
          <Input 
            label="Monthly Budget" 
            type="number" 
            value={form.monthly_budget} 
            onChange={(e) => setForm(f => ({ ...f, monthly_budget: e.target.value }))} 
            required 
          />
          <Button type="submit" variant="primary" className="w-full">Create Project</Button>
        </form>
      </Modal>
    </div>
  );
}

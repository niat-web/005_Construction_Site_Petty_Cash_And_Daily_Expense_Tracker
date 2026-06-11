import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchUsers, createPM, createSupervisor, deleteUser } from '../../features/users/userSlice';
import { fetchProjects } from '../../features/sites/projectSlice';
import { fetchSitesThunk } from '../../features/sites/siteThunks';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((s: RootState) => s.users);
  const { projects } = useSelector((s: RootState) => s.projects);
  const { sites } = useSelector((s: RootState) => s.sites);
  
  const [showModal, setShowModal] = useState(false);
  const [roleToCreate, setRoleToCreate] = useState<'project_manager' | 'supervisor'>('project_manager');
  const [form, setForm] = useState({ name: '', username: '', password: '', project_id: '', site_id: '' });

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProjects());
    dispatch(fetchSitesThunk());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roleToCreate === 'project_manager') {
      await dispatch(createPM({
        name: form.name,
        username: form.username,
        password: form.password,
        project_id: Number(form.project_id)
      }));
    } else {
      await dispatch(createSupervisor({
        name: form.name,
        username: form.username,
        password: form.password,
        site_id: Number(form.site_id)
      }));
    }
    setShowModal(false);
    setForm({ name: '', username: '', password: '', project_id: '', site_id: '' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="Users"
        subtitle="Manage Project Managers and Site Supervisors"
        action={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => { setRoleToCreate('project_manager'); setShowModal(true); }}>+ PM</Button>
            <Button variant="primary" onClick={() => { setRoleToCreate('supervisor'); setShowModal(true); }}>+ Supervisor</Button>
          </div>
        }
      />

      {loading ? <Loader /> : (
        !users.length ? (
          <EmptyState title="No users found" description="Create a user to get started." />
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Assignment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-semibold text-slate-800">{u.name}</td>
                    <td>{u.username}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-purple' : u.role === 'project_manager' ? 'badge-blue' : 'badge-green'}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-sm text-slate-500">
                      {u.project_id ? `Project #${u.project_id}` : ''}
                      {u.site_id ? `Site #${u.site_id}` : ''}
                      {(!u.project_id && !u.site_id) ? 'Global' : ''}
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <Button variant="danger" onClick={() => handleDelete(u.id)} className="text-xs px-2 py-1">Delete</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`Create ${roleToCreate === 'project_manager' ? 'Project Manager' : 'Supervisor'}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Username" value={form.username} onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required />
          
          {roleToCreate === 'project_manager' ? (
            <div>
              <label className="form-label">Assign to Project <span className="text-red-500">*</span></label>
              <select className="form-select" value={form.project_id} onChange={(e) => setForm(f => ({ ...f, project_id: e.target.value }))} required>
                <option value="">Select Project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.project_name}</option>)}
              </select>
            </div>
          ) : (
            <div>
              <label className="form-label">Assign to Site <span className="text-red-500">*</span></label>
              <select className="form-select" value={form.site_id} onChange={(e) => setForm(f => ({ ...f, site_id: e.target.value }))} required>
                <option value="">Select Site...</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.site_name} ({s.site_code})</option>)}
              </select>
            </div>
          )}
          
          <Button type="submit" variant="primary" className="w-full">Create User</Button>
        </form>
      </Modal>
    </div>
  );
}

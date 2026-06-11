import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import {
  getIssuancesApi, createIssuanceApi, deleteIssuanceApi,
} from '../../api/cashApi';
import type { CashIssuance, IssuanceFilters } from '../../api/cashApi';
import { fetchSitesThunk } from '../../features/sites/siteThunks';
import PageHeader from '../../components/common/PageHeader';
import CashIssuanceTable from '../../components/cash/CashIssuanceTable';
import CashIssuanceForm from '../../components/cash/CashIssuanceForm';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

export default function AdminCashIssuancePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sites } = useSelector((s: RootState) => s.sites);
  const [issuances, setIssuances] = useState<CashIssuance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [issuing, setIssuing] = useState(false);

  const loadIssuances = useCallback(async (filters?: IssuanceFilters) => {
    const res = await getIssuancesApi(filters);
    setIssuances(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    dispatch(fetchSitesThunk());
    loadIssuances();
  }, [dispatch, loadIssuances]);

  const handleCreate = async (data: { site_id: number; amount: number; issue_date: string }) => {
    setIssuing(true);
    await createIssuanceApi(data);
    setIssuing(false);
    setShowModal(false);
    loadIssuances();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this issuance?')) {
      await deleteIssuanceApi(id);
      loadIssuances();
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="Cash Issuances"
        subtitle="Issue and track petty cash for sites"
        action={<Button variant="primary" onClick={() => setShowModal(true)}>+ Issue Cash</Button>}
      />

      {loading ? <Loader /> : <CashIssuanceTable issuances={issuances} onDelete={handleDelete} showDelete />}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Issue Petty Cash">
        <CashIssuanceForm sites={sites} onSubmit={handleCreate} loading={issuing} />
      </Modal>
    </div>
  );
}

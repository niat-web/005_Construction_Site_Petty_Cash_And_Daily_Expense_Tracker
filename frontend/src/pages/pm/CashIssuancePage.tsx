import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import {
  getIssuancesApi, createIssuanceApi, deleteIssuanceApi,
} from '../../api/cashApi';
import type { CashIssuance } from '../../api/cashApi';
import { fetchSitesThunk } from '../../features/sites/siteThunks';
import PageHeader from '../../components/common/PageHeader';
import CashIssuanceTable from '../../components/cash/CashIssuanceTable';
import CashIssuanceForm from '../../components/cash/CashIssuanceForm';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

export default function PMCashIssuancePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sites } = useSelector((s: RootState) => s.sites);
  const [issuances, setIssuances] = useState<CashIssuance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    dispatch(fetchSitesThunk());
    loadIssuances();
  }, [dispatch]);

  const loadIssuances = async () => {
    setLoading(true);
    const res = await getIssuancesApi();
    setIssuances(res.data);
    setLoading(false);
  };

  const handleCreate = async (data: { site_id: number; amount: number; issue_date: string }) => {
    setIssuing(true);
    await createIssuanceApi(data);
    setIssuing(false);
    setShowModal(false);
    loadIssuances();
  };

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="Cash Issuances"
        subtitle="Issue petty cash to your sites"
        action={<Button variant="primary" onClick={() => setShowModal(true)}>+ Issue Cash</Button>}
      />

      {loading ? <Loader /> : <CashIssuanceTable issuances={issuances} />}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Issue Petty Cash">
        <CashIssuanceForm sites={sites} onSubmit={handleCreate} loading={issuing} />
      </Modal>
    </div>
  );
}

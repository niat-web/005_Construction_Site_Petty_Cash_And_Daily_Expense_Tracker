import { useEffect, useState } from 'react';
import { getIssuancesApi } from '../../api/cashApi';
import type { CashIssuance } from '../../api/cashApi';
import PageHeader from '../../components/common/PageHeader';
import CashIssuanceTable from '../../components/cash/CashIssuanceTable';
import Loader from '../../components/common/Loader';

export default function SupervisorCashIssuancePage() {
  const [issuances, setIssuances] = useState<CashIssuance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIssuancesApi()
      .then((res) => setIssuances(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 fade-in">
      <PageHeader title="Cash Received" subtitle="Cash issued to your site (read-only)" />
      {loading ? <Loader /> : <CashIssuanceTable issuances={issuances} showDelete={false} />}
    </div>
  );
}

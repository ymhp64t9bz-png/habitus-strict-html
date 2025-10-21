import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { SubscriptionModal } from "./SubscriptionModal";
import Splash from "@/pages/Splash";

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, hasActiveAccess, needsSubscription, checkSubscription } = useUser();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && user && needsSubscription) {
      setShowModal(true);
    }
  }, [loading, user, needsSubscription]);

  const handleSubscriptionComplete = async () => {
    await checkSubscription();
    setShowModal(false);
  };

  if (loading) {
    return <Splash />;
  }

  return (
    <>
      {showModal && (
        <SubscriptionModal 
          open={showModal} 
          onSubscriptionComplete={handleSubscriptionComplete}
        />
      )}
      {children}
    </>
  );
}

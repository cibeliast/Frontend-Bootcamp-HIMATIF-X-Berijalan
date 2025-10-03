"use client";
import { IQueue } from "@/interfaces/services/queue.interface";
import React, { useState } from "react";
import Card from "../atoms/Card";
import ReleaseQueueForm from "../molecules/ReleaseQueueForm";
import QueueCard from "../molecules/QueueCard";
import { useSearchQueue } from "@/services/queue/wrapper.service";

const QueueStatusChecker: React.FC<{ className?: string }> = ({ className }) => {
  const [queueNumber, setQueueNumber] = useState("");
  const [queueDetails, setQueueDetails] = useState<IQueue | null>(null);
  const [notFound, setNotFound] = useState(false);

  const searchQueueQuery = useSearchQueue(queueNumber);

  const handleSubmit = async (data: { queueNumber: string }) => {
  const value = data.queueNumber;
  setQueueNumber(value);
  setQueueDetails(null);
  setNotFound(false);

  try {
    const response = await searchQueueQuery.refetch();
    const queues = response.data?.data ?? [];
    if (queues.length > 0) {
      setQueueDetails(queues[0]);
    } else {
      setNotFound(true);
    }
  } catch {
    setNotFound(true);
  }
};


  return (
    <div className={className}>
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Cek Status Antrian
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Masukkan nomor antrean Anda untuk memeriksa status
        </p>

        <ReleaseQueueForm onSubmit={handleSubmit} isLoading={searchQueueQuery.isFetching} />
      </Card>

      {queueDetails && (
        <QueueCard queue={queueDetails} />
      )}

      {notFound && queueNumber && (
        <Card variant="outline" className="text-center py-6 text-gray-500">
          Nomor antrian <strong>{queueNumber}</strong> tidak ditemukan.
        </Card>
      )}
    </div>
  );
};

export default QueueStatusChecker;
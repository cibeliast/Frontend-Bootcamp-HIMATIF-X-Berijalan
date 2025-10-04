"use client";
import React, { useState } from "react";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import Select from "../atoms/Select";
import CurrentQueueDisplay from "../molecules/CurrentQueueDisplay";
import { ICounter } from "@/interfaces/services/counter.interface";
import { IQueue } from "@/interfaces/services/queue.interface";
import { useGetAllCounters } from "@/services/counter/wrapper.service";
import {
  useGetCurrentQueues,
  useNextQueue,
  useSkipQueue,
  useClaimQueue,
  useReleaseQueue,
} from "@/services/queue/wrapper.service";

const CounterOperator: React.FC = () => {
  const { data: allCountersData } = useGetAllCounters();
  const activeCounters = (allCountersData?.data ?? []).filter((c) => c.isActive);

  const [selectedCounter, setSelectedCounter] = useState<ICounter | null>(null);

  // Current queue untuk semua counter
  const { data: currentQueuesData, refetch: refetchQueues } = useGetCurrentQueues();

  const nextQueue = useNextQueue();
  const skipQueue = useSkipQueue();
  const claimQueue = useClaimQueue();
  const releaseQueue = useReleaseQueue();

  const selectedQueue = currentQueuesData?.data?.find((q) => q.id === selectedCounter?.id);

  const handleCounterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const counterId = Number(e.target.value);
    const counter = activeCounters.find((c) => c.id === counterId) || null;
    setSelectedCounter(counter);
  };

  return (
    <div>
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">OPERATOR COUNTER</h2>
        <p className="text-center text-gray-600 mb-6">
          Panel untuk operator counter melayani antrian pengunjung
        </p>

        <Select
          label="Pilih Counter"
          fullWidth
          value={selectedCounter?.id.toString() ?? ""}
          onChange={handleCounterChange}
          options={[
            { value: "", label: "Pilih Counter", disabled: true },
            ...activeCounters.map((c) => ({ value: c.id.toString(), label: c.name })),
          ]}
        />
      </Card>

      {selectedCounter ? (
        <div className="space-y-6">
          <CurrentQueueDisplay
            counterName={selectedCounter.name}
            queueNumber={selectedQueue?.currentQueue ?? 0}
            status={selectedQueue?.status ?? "RESET"}
          />

          <div className="flex gap-4 flex-wrap">
            <Button
              fullWidth
              onClick={handleNextQueue}
              leftIcon={<span className="material-symbols-outlined">arrow_forward</span>}
            >
              Panggil Antrian Berikutnya
            </Button>

            {selectedQueue && (
              <Button
                variant="danger"
                fullWidth
                onClick={handleSkipQueue}
                leftIcon={<span className="material-symbols-outlined">skip_next</span>}
              >
                Lewati Antrian
              </Button>
            )}

            {selectedQueue && (
              <Button
                variant="outline"
                fullWidth
                onClick={handleReleaseQueue}
                leftIcon={<span className="material-symbols-outlined">done</span>}
              >
                Lepaskan Antrian
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Card variant="outline" className="text-center py-8 text-gray-500">
          Silahkan pilih counter untuk mulai melayani antrian
        </Card>
      )}
    </div>
  );
};

export default CounterOperator;

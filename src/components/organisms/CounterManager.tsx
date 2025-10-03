"use client";
import React, { useState } from "react";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import CounterForm from "../molecules/CounterForm";
import { ICounter, ICreateCounterRequest, IUpdateCounterRequest } from "@/interfaces/services/counter.interface";
import { useGetAllCounters, useCreateCounter, useUpdateCounter, useDeleteCounter } from "@/services/counter/wrapper.service";

interface CounterManagerProps {
  className?: string;
}

export default function CounterManager({ className }: CounterManagerProps) {
  const [isAddingCounter, setIsAddingCounter] = useState(false);
  const [editingCounter, setEditingCounter] = useState<ICounter | null>(null);
  const [selectedCounterId, setSelectedCounterId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useGetAllCounters();
  const counters = data?.data ?? [];

  const { mutate: createCounter } = useCreateCounter();
  const { mutate: updateCounter } = useUpdateCounter();
  const { mutate: deleteCounter } = useDeleteCounter();

  const handleSubmit = (data: ICreateCounterRequest | IUpdateCounterRequest) => {
    if (editingCounter) {
      // update
      updateCounter({ ...data, id: editingCounter.id } as IUpdateCounterRequest, {
        onSuccess: () => refetch(),
      });
    } else {
      // create
      createCounter(data as ICreateCounterRequest, {
        onSuccess: () => refetch(),
      });
    }
    setIsAddingCounter(false);
    setEditingCounter(null);
    setSelectedCounterId(null);
  };

  const handleSelectCounter = (counter: ICounter) => {
    setSelectedCounterId(selectedCounterId === counter.id ? null : counter.id);
  };

  const handleEditCounter = () => {
    if (selectedCounterId !== null) {
      const counter = counters.find(c => c.id === selectedCounterId) ?? null;
      setEditingCounter(counter);
      setIsAddingCounter(true);
    }
  };

  const handleDeleteCounter = () => {
    if (selectedCounterId !== null) {
      deleteCounter(selectedCounterId, { onSuccess: () => refetch() });
      setSelectedCounterId(null);
    }
  };

  // const handleToggleActive = () => {
  //   if (selectedCounterId !== null) {
  //     const counter = counters.find(c => c.id === selectedCounterId);
  //     if (counter) {
  //       updateCounter({ ...counter, is_active: !counter.isActive } as IUpdateCounterRequest, {
  //         onSuccess: () => refetch(),
  //       });
  //     }
  //   }
  // };

  return (
    <div className={className}>
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Counter</h2>
            <p className="text-gray-600 mt-1">Kelola counter/loket pelayanan</p>
          </div>
          {!isAddingCounter && !editingCounter && (
            <Button
              onClick={() => setIsAddingCounter(true)}
              leftIcon={<span className="material-symbols-outlined">add</span>}
            >
              Tambah Counter
            </Button>
          )}
        </div>
      </Card>

      {isAddingCounter || editingCounter ? (
        <Card>
          <h3 className="text-lg font-semibold mb-4">
            {editingCounter ? "Edit Counter" : "Tambah Counter Baru"}
          </h3>
          <CounterForm
            counter={editingCounter ?? undefined}
            onSubmit={handleSubmit}
            isLoading={false}
            isEditMode={!!editingCounter}
          />
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingCounter(false);
                setEditingCounter(null);
                setSelectedCounterId(null);
              }}
            >
              Batal
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {selectedCounterId !== null && (
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                onClick={handleEditCounter}
                leftIcon={<span className="material-symbols-outlined">edit</span>}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                // onClick={handleToggleActive}
                leftIcon={<span className="material-symbols-outlined">toggle_on</span>}
              >
                Toggle Active
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteCounter}
                leftIcon={<span className="material-symbols-outlined">delete</span>}
              >
                Hapus
              </Button>
            </div>
          )}

          {isLoading ? (
            <p className="text-center py-8">Loading counters...</p>
          ) : counters.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Queue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Queue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {counters.map((counter) => (
                    <tr key={counter.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{counter.name}</td>
                      <td className="px-6 py-4">{counter.currentQueue}</td>
                      <td className="px-6 py-4">{counter.maxQueue}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            counter.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {counter.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCounter(counter);
                              setIsAddingCounter(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              deleteCounter(counter.id, {
                                onSuccess: () => refetch(),
                              });
                            }}
                          >
                            Hapus
                          </Button>
                          <Button
                            size="sm"
                            variant={counter.isActive ? "secondary" : "primary"}
                            // onClick={() => {
                            //   updateCounter(
                            //     { ...counter, is_active: !counter.isActive },
                            //     { onSuccess: () => refetch() }
                            //   );
                            // }}
                          >
                            {counter.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card variant="outline" className="text-center py-8 text-gray-500">
              Belum ada counter. Klik 'Tambah Counter' untuk membuat counter baru.
            </Card>
          )}
        </>
      )}
    </div>
  );
}
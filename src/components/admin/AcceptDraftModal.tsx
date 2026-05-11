"use client";

import { useState } from "react";
import { updateDraftStatus } from "@/app/actions/updateDraftStatus";

export default function AcceptDraftModal({
    draftId,
    currentPrice,
}: {
    draftId: string;
    currentPrice: number;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Trigger */}
            <button
                onClick={() => setOpen(true)}
                className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700"
            >
                Accept Draft
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-[var(--radius-lg)] bg-white p-5 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-[var(--text-primary)]">
                                Accept Draft
                            </h2>

                            <button
                                onClick={() =>
                                    setOpen(false)
                                }
                                className="text-sm text-[var(--text-secondary)]"
                            >
                                Close
                            </button>
                        </div>

                        <form
                            action={async (
                                formData
                            ) => {
                                await updateDraftStatus(
                                    draftId,
                                    "accepted",
                                    formData
                                );

                                setOpen(false);
                            }}
                            className="mt-5 flex flex-col gap-4"
                        >
                            {/* Original Price */}
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                                    Evaluated Price
                                </p>

                                <div className="mt-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]">
                                    ₹{currentPrice}
                                </div>
                            </div>

                            {/* Negotiated Price */}
                            <div>
                                <label className="text-sm font-medium text-[var(--text-primary)]">
                                    Final Negotiated Price
                                </label>

                                <input
                                    type="number"
                                    name="negotiated_price"
                                    defaultValue={
                                        currentPrice
                                    }
                                    className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-2 text-sm"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="text-sm font-medium text-[var(--text-primary)]">
                                    Admin Notes
                                </label>

                                <textarea
                                    name="admin_notes"
                                    rows={4}
                                    placeholder="Customer negotiated amount, pickup discussion, internal notes..."
                                    className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-2 text-sm"
                                />
                            </div>

                            {/* Actions */}
                            <div className="mt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(false)
                                    }
                                    className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 text-sm font-medium text-[var(--text-primary)]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700"
                                >
                                    Confirm Acceptance
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
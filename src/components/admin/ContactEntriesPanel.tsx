// src/components/admin/ContactEntriesPanel.tsx

import { useEffect, useState } from "react";

import { deleteContact, getContacts } from "../../api/contact";

import type { Contact } from "../../api/contact";

export const ContactEntriesPanel = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const data = await getContacts();

      setContacts(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this contact entry?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteContact(id);

      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-white/60">
        Loading contact entries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500/20 bg-red-500/10 text-red-300 rounded-2xl px-4 py-3">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Contact Entries</h3>

          <p className="text-white/50 text-sm mt-1">
            Manage all submitted contact forms.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl border border-white/10 text-sm text-white/60">
          {contacts.length} Entries
        </div>
      </div>

      {/* EMPTY */}
      {contacts.length === 0 && (
        <div className="border border-dashed border-white/10 rounded-2xl py-16 text-center text-white/50">
          No contact entries found.
        </div>
      )}

      {/* CONTACTS */}
      <div className="grid gap-5">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
          >
            {/* TOP */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* LEFT */}
              <div className="flex-1 space-y-5">
                {/* NAME */}
                <div>
                  <p className="text-sm text-white/40 mb-1">Full Name</p>

                  <h2 className="text-2xl font-semibold">
                    {contact.fullName || "Unknown"}
                  </h2>
                </div>

                {/* INFO GRID */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm text-white/40 mb-1">Email Address</p>

                    <p className="text-white/80 break-all">
                      {contact.email || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/40 mb-1">Phone Number</p>

                    <p className="text-white/80">
                      {contact.phoneNumber || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/40 mb-1">Subject</p>

                    <p className="text-white/80 capitalize">
                      {contact.subject || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-white/40 mb-1">Submitted On</p>

                    <p className="text-white/80">
                      {contact.createdAt
                        ? new Date(contact.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div>
                <button
                  onClick={() => handleDelete(contact.id)}
                  disabled={deletingId === contact.id}
                  className="px-5 py-2 rounded-xl border border-green-500/20 bg-green-500/10 text-green-300 hover:bg-green-500/20 transition-all disabled:opacity-50"
                >
                  {deletingId === contact.id ? "Deleting..." : "Resolve"}
                </button>
              </div>
            </div>

            {/* PROJECT INFO */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-sm text-white/40 mb-2">Project Information</p>

              <div className="rounded-2xl bg-black/20 border border-white/5 p-4">
                <p className="text-white/75 whitespace-pre-wrap leading-relaxed">
                  {contact.projectInfo || "No project information provided."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

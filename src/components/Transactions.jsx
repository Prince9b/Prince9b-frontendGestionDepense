import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  PlusCircle,
  Trash,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import toast from "react-hot-toast";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [montant, setMontant] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem(ACCESS_TOKEN);

  const getTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("api/transactions/");
      setTransactions(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`api/transaction/${id}/`);
      getTransactions();
      toast.success("Transaction supprimée avec success");
    } catch (error) {
      console.error("Erreur suppression transaction", error);
    }
  };

  const AddTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post("api/transactions/", {
        title,
        description,
        montant,
      });
      toast.success("Transaction ajoutée avec success");
      await getTransactions();
      const modal = document.getElementById("my_modal_3");
      if (modal) {
        modal.close();
      }
      setTitle("");
      setDescription("");
      setMontant("");
    } catch (error) {}
  };

  useEffect(() => {
    if (token) {
      getTransactions();
    }
  }, [token]);

  const { solde, revenus, depenses } = useMemo(() => {
    const montants = transactions.map((t) => Number(t.montant) || 0);

    const solde = montants.reduce((acc, item) => acc + item, 0);
    const revenus = montants
      .filter((m) => m > 0)
      .reduce((acc, item) => acc + item, 0);
    const depenses = montants
      .filter((m) => m < 0)
      .reduce((acc, item) => acc + item, 0);

    return { solde, revenus, depenses };
  }, [transactions]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between border-2 border-dashed border-warning/10 bg-warning/10 p-5">
        {loading ? (
          <div className="flex justify-center items-center ml-150">
            <span className="loading loading-spinner p-20"></span>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <div className="badge badge-soft badge-info">
                <Wallet className="md:w-4 w-3 md:h-4 h-3" />
                Votre Solde
              </div>
              <div className="md:stat-value">{solde.toFixed(2)}CFA</div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="badge bagde-soft badge-success">
                <ArrowUpCircle className="md:w-4 w-3 md:h-4 h-3" /> Revenus
              </div>
              <div className="md:stat-value">{revenus.toFixed(2)}CFA</div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="badge badge-soft badge-error">
                <ArrowDownCircle className="md:w-4 w-3 md:h-4 h-3" /> Depenses
              </div>
              <div className="md:stat-value">{depenses.toFixed(2)}CFA</div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-center ">
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="btn btn-warning w-full "
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          <PlusCircle className="w-4 h-4" />
          Ajouter une transaction
        </button>

        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Ajouter une transaction</h3>
            <form onSubmit={AddTransaction}>
              <div className="flex flex-col gap-2 mt-6">
                <label>Titre</label>
                <input
                  type="text"
                  placeholder="Titre de la transaction"
                  className="input w-full border-dashed"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                  placeholder="Details de votre transaction"
                  className="textarea textarea-xs w-full border-dashed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <label className="label">
                  Montant (négatif - dépense, positif - revenu)
                </label>
                <input
                  type="number"
                  placeholder="dépense(-)"
                  className="input w-full border-dashed"
                  value={montant}
                  onChange={(e) =>
                    setMontant(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
                <button type="submit" className="btn btn-warning mt-2">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>

      <div className="mt-10 p-3">
        <div className="overflow-x-auto rounded-box border-2 border-dashed border-base-content/5 bg-base-100 w-full">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th className="hidden md:table-cell">#</th>
                <th>Titre</th>
                <th>Montant</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={t.id}>
                  <th className="hidden md:table-cell">{index + 1}</th>
                  <td>
                    <div className="tooltip">
                      <div className="tooltip-content w-100">
                        <div className="text-sm font-black">
                          <p className="break-words whitespace-normal max-w-xs">
                            {t.description}
                          </p>
                        </div>
                      </div>
                      <button className="cursor-pointer truncate max-w-22.5 md:max-w-full">
                        {t.title}
                      </button>
                    </div>
                  </td>
                  <td className="flex md:gap-2 gap-0.2 font-semibold">
                    {t.montant > 0 ? (
                      <TrendingUp className="text-success w-6 h-6" />
                    ) : (
                      <TrendingDown className="text-error w-6 h-6" />
                    )}
                    {t.montant}
                  </td>
                  <td className="max-w-22.5 truncate md:max-w-full">
                    {new Date(t.created_at).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    {" "}
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="btn btn-error btn-xs md:btn-sm btn-soft"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;

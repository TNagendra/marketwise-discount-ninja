// pages/stores/[id].js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function StoreDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [store, setStore] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discountPage, setDiscountPage] = useState(1);
  const [discountTotal, setDiscountTotal] = useState(0);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const res = await fetch(
          `/api/stores/${id}?page=${discountPage}&limit=10`
        );
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        setStore(data.store || null);
        setDiscounts(
          data.discounts && data.discounts.discounts
            ? data.discounts.discounts
            : data.discounts || []
        );
        setDiscountTotal(
          data.discounts && data.discounts.total
            ? data.discounts.total
            : data.total || 0
        );
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, discountPage]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!store) {
    return <div className="p-6">Store not found</div>;
  }

  return (
    <div className="p-6">
      <Link
        href="/stores"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Stores
      </Link>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{store.shop}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Owner: {store.shopOwnerName}</p>
            <p className="text-gray-600">Email: {store.email}</p>
            <p className="text-gray-600">Contact Email: {store.contactEmail}</p>
          </div>
          <div>
            <p className="text-gray-600">Plan: {store.planName || "N/A"}</p>
            <p className="text-gray-600">Currency: {store.currencyCode}</p>
            <p className="text-gray-600">Country: {store.billingCountry}</p>
          </div>
        </div>
        <div className="mt-4">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              store.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {store.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Discounts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discounts.map((discount) => (
                <tr key={discount.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/discounts/${discount.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {discount.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        discount.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : discount.status === "DRAFT"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {discount.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.valueType === "PERCENTAGE"
                      ? `${discount.discountAmount}%`
                      : `$${discount.discountAmount}`}
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No discounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setDiscountPage((p) => Math.max(1, p - 1))}
            disabled={discountPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {discountPage} of {Math.ceil(discountTotal / 10)}
          </span>
          <button
            onClick={() => setDiscountPage((p) => p + 1)}
            disabled={discountPage * 10 >= discountTotal}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

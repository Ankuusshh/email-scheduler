import { useEffect, useState } from "react";
import {
    getEmails,
    getScheduledEmails,
    getSentEmails
} from "../services/api";

function Dashboard({ token, onLogout, onCompose }) {

    const [emails, setEmails] = useState([]);
    const [scheduled, setScheduled] = useState([]);
    const [sent, setSent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadEmails = async () => {
        try {
            setLoading(true);
            setError("");

            const [allEmails, scheduledEmails, sentEmails] =
                await Promise.all([
                    getEmails(token),
                    getScheduledEmails(token),
                    getSentEmails(token)
                ]);

            setEmails(allEmails);
            setScheduled(scheduledEmails);
            setSent(sentEmails);

        } catch (error) {
            setError(error.message);

            if (error.message.includes("expired")) {
                localStorage.removeItem("token");
                onLogout();
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    loadEmails();

    const interval = setInterval(() => {
        loadEmails();
    }, 5000);

    return () => clearInterval(interval);
}, []);

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Navbar */}
            <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">

                <h1 className="text-2xl font-bold text-blue-600">
                    Email Scheduler
                </h1>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        onLogout();
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>

            </nav>

            <main className="p-8">

                <h2 className="text-3xl font-bold mb-6">
                    Dashboard
                </h2>
                <button
    onClick={onCompose}
    className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 mb-6"
>
    + Compose Email
</button>

                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">
                            Total Emails
                        </p>

                        <h3 className="text-3xl font-bold mt-2">
                            {emails.length}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">
                            Scheduled
                        </p>

                        <h3 className="text-3xl font-bold text-orange-500 mt-2">
                            {scheduled.length}
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                        <p className="text-gray-500">
                            Sent
                        </p>

                        <h3 className="text-3xl font-bold text-green-600 mt-2">
                            {sent.length}
                        </h3>
                    </div>

                </div>

                {/* Scheduled Emails */}
                <div className="bg-white rounded-xl shadow mb-8">

                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold">
                            Scheduled Emails
                        </h3>
                    </div>

                    {loading ? (
                        <p className="p-6 text-gray-500">
                            Loading...
                        </p>
                    ) : scheduled.length === 0 ? (
                        <p className="p-6 text-gray-500">
                            No scheduled emails.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4">
                                            Recipient
                                        </th>

                                        <th className="text-left p-4">
                                            Subject
                                        </th>

                                        <th className="text-left p-4">
                                            Scheduled At
                                        </th>

                                        <th className="text-left p-4">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {scheduled.map((email) => (
                                        <tr
                                            key={email.id}
                                            className="border-t"
                                        >
                                            <td className="p-4">
                                                {email.recipient}
                                            </td>

                                            <td className="p-4">
                                                {email.subject}
                                            </td>

                                            <td className="p-4">
                                                {new Date(
                                                    email.scheduled_at
                                                ).toLocaleString()}
                                            </td>

                                            <td className="p-4">
                                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                                                    {email.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

                {/* Sent Emails */}
                <div className="bg-white rounded-xl shadow">

                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold">
                            Sent Emails
                        </h3>
                    </div>

                    {loading ? (
                        <p className="p-6 text-gray-500">
                            Loading...
                        </p>
                    ) : sent.length === 0 ? (
                        <p className="p-6 text-gray-500">
                            No sent emails.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4">
                                            Recipient
                                        </th>

                                        <th className="text-left p-4">
                                            Subject
                                        </th>

                                        <th className="text-left p-4">
                                            Sent At
                                        </th>

                                        <th className="text-left p-4">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {sent.map((email) => (
                                        <tr
                                            key={email.id}
                                            className="border-t"
                                        >
                                            <td className="p-4">
                                                {email.recipient}
                                            </td>

                                            <td className="p-4">
                                                {email.subject}
                                            </td>

                                            <td className="p-4">
                                                {email.sent_at
                                                    ? new Date(
                                                        email.sent_at
                                                    ).toLocaleString()
                                                    : "-"
                                                }
                                            </td>

                                            <td className="p-4">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                                    {email.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}

export default Dashboard;
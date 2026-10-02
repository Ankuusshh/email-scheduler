import { useState } from "react";
import { scheduleEmail } from "../services/api";

function ComposeEmail({ token, onBack }) {

    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            await scheduleEmail(token, {
                recipient,
                subject,
                body,
                scheduledAt
            });

            setMessage("Email scheduled successfully!");

            setRecipient("");
            setSubject("");
            setBody("");
            setScheduledAt("");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">

            <nav className="bg-white shadow-sm px-8 py-4">
                <div className="flex justify-between items-center">

                    <h1 className="text-2xl font-bold text-blue-600">
                        Email Scheduler
                    </h1>

                    <button
                        onClick={onBack}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        Back to Dashboard
                    </button>

                </div>
            </nav>

            <main className="max-w-3xl mx-auto p-8">

                <div className="bg-white rounded-xl shadow p-8">

                    <h2 className="text-3xl font-bold mb-2">
                        Compose Email
                    </h2>

                    <p className="text-gray-500 mb-8">
                        Schedule an email to be sent later.
                    </p>

                    {message && (
                        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <label className="block mb-2 font-medium">
                            Recipient
                        </label>

                        <input
                            type="email"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="recipient@example.com"
                            className="w-full border rounded-lg px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <label className="block mb-2 font-medium">
                            Subject
                        </label>

                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject"
                            className="w-full border rounded-lg px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <label className="block mb-2 font-medium">
                            Message
                        </label>

                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write your email message..."
                            rows="6"
                            className="w-full border rounded-lg px-4 py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <label className="block mb-2 font-medium">
                            Schedule Date & Time
                        </label>

                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {loading
                                ? "Scheduling..."
                                : "Schedule Email"
                            }
                        </button>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default ComposeEmail;
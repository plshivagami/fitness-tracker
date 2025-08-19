import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import Activity from "./Activity";
export default function Activities() {
  const { token } = useAuth(); // user info + auth token

  // --- Fetch activities ---
  const {
    data: activities,
    loading,
    error,
  } = useQuery("/activities", "activities");

  // --- Delete activity mutation ---
  const {
    mutate: deleteActivity,
    error: deleteError,
    loading: deleting,
  } = useMutation(
    "DELETE",
    (id) => `/activities/${id}`, // API expects DELETE /activities/:id
    ["activities"]
  );

  // --- Create activity mutation ---
  const {
    mutate: createActivity,
    error: createError,
    loading: creating,
  } = useMutation("POST", "/activities", ["activities"]);

  // --- Form state ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // --- Handle create ---
  const handleCreate = async (e) => {
    e.preventDefault();
    await createActivity({ name, description });
    setName("");
    setDescription("");
  };

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <section>
      <h1>Activities</h1>

      {activities?.length === 0 && <p>No activities found.</p>}

      {deleteError && (
        <span
          style={{
            color: "orange",
            marginLeft: "8px",
            backgroundColor: "#f0f0f0",
          }}
        >
          {deleteError}
        </span>
      )}

      <ul>
        {activities?.map((activity) => (
          <Activity key={activity.id} activity={activity} />
        ))}
      </ul>

      {token && (
        <form onSubmit={handleCreate} style={{ marginTop: "20px" }}>
          <h2>Create New Activity</h2>

          <label>
            Name <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <br />

          <label>
            Description <br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <br />

          <button type="submit" disabled={creating}>
            {creating ? "Adding..." : "Add Activity"}
          </button>
          {createError && (
            <p style={{ color: "red" }}>Create failed: {createError}</p>
          )}
        </form>
      )}
    </section>
  );
}

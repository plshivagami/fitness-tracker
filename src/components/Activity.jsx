import { useAuth } from "../auth/AuthContext";
import useMutation from "../api/useMutation";

export default function Activity({ activity }) {
  const { token } = useAuth(); // user info + auth token
  const {
    mutate: deleteActivity,
    error: deleteError,
    loading: deleting,
  } = useMutation(
    "DELETE",
    (id) => `/activities/${id}`, // API expects DELETE /activities/:id
    ["activities"]
  );
  return (
    <li key={activity.id}>
      <strong>{activity.name}</strong>
      <br></br>

      {token && (
        <button
          disabled={deleting}
          onClick={() => deleteActivity(activity.id)}
          style={{ marginLeft: "10px" }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      )}
      <div>
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
      </div>
    </li>
  );
}

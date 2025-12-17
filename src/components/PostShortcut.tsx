export default function PostShortcut({ post }: any) {
  return (
    <>
      <li key={post._id} className="mb-4 list-unstyled">
        <div className="d-flex flex-column flex-md-row gap-3">
          {post.Image && (
            <img
              className="me-3"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
              src={post.Image}
              alt={post.Title}
            />
          )}
          <div className={!post.Image ? "" : "ml-md-3"}>
            <a className="text-decoration-none" href={`/post/${post.id}`}>
              <h3 className="mb-0">{post.Title}</h3>
              {post.Content && (
                <p className="text-mute m-0">
                  {
                    typeof post.Content === "string"
                      ? post.Content.replace(/<[^>]+>/g, "").substring(0, 100) // Jika Content adalah string
                      : post.Content[0]?.babContent
                          ?.replace(/<[^>]+>/g, "")
                          .substring(0, 120) // Jika Content adalah list dengan babContent
                  }
                  ...
                </p>
              )}
              <p className="mb-1">- By {post.Pembuat}</p>
            </a>
          </div>
        </div>
      </li>
    </>
  );
}

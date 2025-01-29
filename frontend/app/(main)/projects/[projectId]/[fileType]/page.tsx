"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Download, Upload, X, Check } from "lucide-react";
import { deleteUrl, uploadUrl } from "@/services/upload";
import useFetchData from "@/hooks/useFetchData";
import { getProject, updateProjectStatus } from "@/services/project";
import { Alert, Snackbar } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";

function UploadAndDisplayContent({
  params,
}: {
  params: { projectId: string; fileType: string };
}) {
  const { data: project, loading: projectLoading } = useFetchData(getProject, [
    params.projectId,
  ]);
  const [uploadedContentUrl, setUploadedContentUrl] = useState<string | null>(
    null
  );
  const { projectId, fileType } = params as {
    projectId: string;
    fileType: "abstract" | "video_demo" | "report";
  };
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const { user } = useAuth();
  const [comment, setComment] = useState("");

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  useEffect(() => {
    if (project && project[`${fileType}_url`]) {
      setUploadedContentUrl(project[`${fileType}_url`]);
    }
  }, [project, fileType]);

  const saveContentUrlToDB = async (
    url: string,
    projectId: string,
    fileType: "abstract" | "video_demo" | "report"
  ) => {
    await uploadUrl(projectId, url, fileType);
    console.log(`Saving ${fileType} URL to database:`, url);
  };

  const deleteContentFromDB = async (projectId: string, fileType: string) => {
    await deleteUrl(projectId, fileType);
    console.log(`Deleting ${fileType} URL from database`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = (result: any) => {
    const secureUrl = result?.info?.secure_url;
    if (secureUrl) {
      console.log(`Uploaded ${fileType} URL:`, secureUrl);

      setUploadedContentUrl(secureUrl);
      window.location.reload();
      saveContentUrlToDB(secureUrl, projectId, fileType);

      setSnackBarMessage(`${fileType} uploaded successfully!`);
      setSeverity("success");
      setOpenSnackBar(true);
    }
  };

  const handleDeleteContent = () => {
    deleteContentFromDB(projectId, fileType);
    setUploadedContentUrl(null);

    setSnackBarMessage(`${fileType} deleted successfully!`);
    setSeverity("success");
    setOpenSnackBar(true);
  };

  if (projectLoading) {
    return (
      <div className="w-full flex justify-center">
        <span className="loading loading-dots loading-lg bg-primary"></span>
      </div>
    );
  }

  const handleDecision = async (status: "approve" | "reject") => {
    try {
      await updateProjectStatus(projectId, {
        abstract_comment: comment,
        abstract_status: status,
      });

      setComment("");
    } catch (error) {
      console.error("Error updating project:", error);
      alert("An error occurred while updating the project. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full">
      <Card className="w-[70%]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Upload {fileType.charAt(0).toUpperCase() + fileType.slice(1)}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            You need to upload the {fileType} before the deadline.
          </p>
        </CardHeader>
        <CardContent>
          {!uploadedContentUrl ? (
            <CldUploadWidget
              uploadPreset={fileType}
              options={{ clientAllowedFormats: ["pdf", "mp4", "jpg"] }}
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <Button
                  onClick={() => {
                    open();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground"
                >
                  <Upload className="h-5 w-5" /> Upload{" "}
                  {fileType.charAt(0).toUpperCase() + fileType.slice(1)}
                </Button>
              )}
            </CldUploadWidget>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  Uploaded{" "}
                  {fileType.charAt(0).toUpperCase() + fileType.slice(1)}:
                </h3>
              </div>
              <div className="relative rounded-lg border border-gray-300 shadow-md">
                {fileType === "abstract" || fileType === "report" ? (
                  <iframe
                    key={uploadedContentUrl}
                    src={uploadedContentUrl}
                    title="Uploaded PDF"
                    width="100%"
                    height="1000px"
                    className="rounded-lg"
                  />
                ) : fileType === "video_demo" ? (
                  <video
                    controls
                    key={uploadedContentUrl}
                    src={uploadedContentUrl}
                    width="100%"
                    className="rounded-lg h-[500px]"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : null}
              </div>
              {fileType === "abstract" &&
                user?.role !== "admin" &&
                project?.abstract_comment && (
                  <div className="p-4 rounded-lg shadow-md bg-secondary flex flex-row items-center justify-between">
                    <h4 className="text-md font-semibold">
                      Admin&apos;s Comment:
                    </h4>
                    <p className="text-sm text-foreground ml-4">
                      {project.abstract_comment}
                    </p>
                  </div>
                )}

              {fileType === "abstract" &&
                user?.role !== "admin" &&
                project?.abstract_status && (
                  <div className="p-4 rounded-lg shadow-md bg-secondary mt-4 flex items-center justify-between">
                    <h4 className="text-md font-semibold">Abstract Status:</h4>
                    <p
                      className={`text-sm ml-4 ${
                        project.abstract_status === "reject"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {project.abstract_status === "reject" ||
                      project.abstract_status === "approve"
                        ? project.abstract_status.charAt(0).toUpperCase() +
                          project.abstract_status.slice(1)
                        : "Pending"}
                    </p>
                  </div>
                )}
              {user?.role === "student" ? (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg shadow-md">
                  <a
                    href={uploadedContentUrl}
                    download
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow transition-all duration-200 hover:bg-secondary/50 focus:ring-4 focus:ring-secondary-300 focus:outline-none"
                    aria-label="Download uploaded content"
                  >
                    <Download className="h-5 w-5" />
                    <span className="hidden sm:inline">Download</span>
                  </a>

                  {(fileType !== "abstract" ||
                    project?.abstract_status !== "approve") && (
                    <>
                      <CldUploadWidget
                        uploadPreset={fileType}
                        options={{ clientAllowedFormats: ["pdf", "mp4"] }}
                        onSuccess={handleUploadSuccess}
                      >
                        {({ open }) => (
                          <Button
                            onClick={() => open()}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow transition-all duration-200 hover:bg-primary/75 hover:text-white focus:ring-4 focus:ring-primary-300 focus:outline-none"
                            aria-label="Upload a new file"
                          >
                            <Upload className="h-5 w-5" />
                            <span className="hidden sm:inline">Upload</span>
                          </Button>
                        )}
                      </CldUploadWidget>

                      <Button
                        onClick={handleDeleteContent}
                        className="flex items-center gap-2 bg-destructive text-white px-4 py-2 rounded-lg shadow transition-all duration-200 hover:bg-red-700 hover:text-white focus:ring-4 focus:ring-red-300 focus:outline-none"
                        aria-label="Delete uploaded content"
                      >
                        <Trash className="h-5 w-5" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                user?.role === "admin" && (
                  <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md">
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex gap-4">
                      <Button
                        onClick={() => handleDecision("approve")}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-200 hover:bg-green-700 focus:ring-4 focus:ring-green-300 focus:outline-none"
                        aria-label="Approve report"
                      >
                        <Check className="h-5 w-5" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleDecision("reject")}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-all duration-200 hover:bg-red-700 focus:ring-4 focus:ring-red-300 focus:outline-none"
                        aria-label="Reject report"
                      >
                        <X className="h-5 w-5" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert severity={severity} variant="filled" className="w-full">
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UploadAndDisplayContent;

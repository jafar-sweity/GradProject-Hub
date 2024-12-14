"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Download, Upload } from "lucide-react";
import { deleteUrl, uploadUrl } from "@/services/upload";
import useFetchData from "@/hooks/useFetchData";
import { getProject } from "@/services/project";

function UploadAndDisplayPDF({ params }: { params: { projectId: string } }) {
  const { data: project, loading: projectLoading } = useFetchData(getProject, [
    params.projectId,
  ]);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);
  const { projectId } = params;

  useEffect(() => {
    if (project && project.abstract_url) {
      setUploadedPdfUrl(project.abstract_url);
    }
  }, [project]);

  const savePdfUrlToDB = async (url: string, projectId: string) => {
    await uploadUrl(projectId, url, "abstract");
    console.log("Saving PDF URL to database:", url);
  };

  const deletePdfFromDB = async (projectId: string) => {
    await deleteUrl(projectId, "abstract");
    console.log("Deleting PDF URL from database");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = (result: any) => {
    const secureUrl = result?.info?.secure_url;
    if (secureUrl) {
      setUploadedPdfUrl(secureUrl);
      window.location.reload();
      savePdfUrlToDB(secureUrl, projectId);
    }
  };

  const handleDeletePdf = () => {
    deletePdfFromDB(projectId);
    setUploadedPdfUrl(null);
  };

  if (projectLoading) {
    return (
      <div className="w-full flex justify-center">
        <span className="loading loading-dots loading-lg bg-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full">
      <Card className="w-[70%]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Upload Abstract
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            You need to upload the abstract before the deadline.
          </p>
        </CardHeader>
        <CardContent>
          {!uploadedPdfUrl ? (
            <CldUploadWidget
              uploadPreset="abstract"
              options={{ clientAllowedFormats: ["pdf"] }}
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <Button
                  onClick={() => {
                    open();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground"
                >
                  <Upload className="h-5 w-5" /> Upload PDF
                </Button>
              )}
            </CldUploadWidget>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Uploaded PDF:</h3>
              </div>
              <div className="relative rounded-lg border border-gray-300 shadow-md">
                <iframe
                  key={uploadedPdfUrl}
                  src={uploadedPdfUrl}
                  title="Uploaded PDF"
                  width="100%"
                  height="1000px"
                  className="rounded-lg"
                />
              </div>
              <div className="flex justify-between gap-4">
                <a
                  href={uploadedPdfUrl}
                  download
                  className="flex-1 bg-emerald-500 text-white font-medium flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-md transition hover:bg-emerald-600 hover:shadow-lg focus:ring focus:ring-emerald-300"
                >
                  <Download className="h-5 w-5" />
                  Download PDF
                </a>

                <Button
                  onClick={handleDeletePdf}
                  className="flex-1 bg-red-500 text-white font-medium flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-md transition hover:bg-red-600 hover:shadow-lg focus:ring focus:ring-red-300"
                >
                  <Trash className="h-5 w-5" />
                  Delete PDF
                </Button>
              </div>
              <CldUploadWidget
                uploadPreset="abstract"
                options={{ clientAllowedFormats: ["pdf"] }}
                onSuccess={handleUploadSuccess}
              >
                {({ open }) => (
                  <Button
                    onClick={() => open()}
                    className="w-full bg-yellow-500 text-white font-medium flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-md transition hover:bg-yellow-600 hover:shadow-lg focus:ring focus:ring-yellow-300"
                  >
                    <Upload className="h-5 w-5" />
                    Replace PDF
                  </Button>
                )}
              </CldUploadWidget>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UploadAndDisplayPDF;

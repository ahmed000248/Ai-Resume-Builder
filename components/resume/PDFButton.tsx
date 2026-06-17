import React from "react";
import { ResumeFormData } from "@/types/resume";
import { generateResumePdf } from "@/lib/pdf/generateResumePdf";
import { Button } from "../ui/Button";
import { Download } from "lucide-react";

type PDFButtonProps = {
  data: ResumeFormData;
};

export function PDFButton({ data }: PDFButtonProps) {
  const handleDownload = () => {
    generateResumePdf(data);
  };

  return (
    <Button variant="primary" size="sm" onClick={handleDownload}>
      <Download className="h-4 w-4 mr-1.5" />
      Download PDF
    </Button>
  );
}

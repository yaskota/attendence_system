import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { toast } from "react-toastify";

function AttendanceFilter() {
  const [startYear, setStartYear] = useState("");
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState("");
  const reportRef = useRef(null);

  const handleSubmit = (type) => async (e) => {
    e.preventDefault();
    try {
      if (type === "roll") {
        const res = await axios.post(
          "http://localhost:8080/api/attendence/rollfilter",
          { rollNo },
          { withCredentials: true }
        );
        setFilterType("roll");
        setFilteredData(res.data);
      } else {
        const res = await axios.post(
          "http://localhost:8080/api/attendence/attendencefilter",
          { start_year: startYear, subject, branch },
          { withCredentials: true }
        );
        setFilterType("class");
        setFilteredData(res.data);
      }
    } catch (error) {
      console.error("Error in filtering");
      if (error.response) {
        toast.error(error.response.data.message)
        console.log(error.response.data);
      }
    }
  };

  const handleDownload = () => {
    if (!reportRef.current) return;

    // Hide the download button temporarily
    const downloadButton = reportRef.current.querySelector(".download-btn");
    if (downloadButton) {
      downloadButton.style.display = "none";
    }

    const opt = {
      margin: 0.5,
      filename: "attendance-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(reportRef.current)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(`Page ${i} of ${totalPages}`, 0.5, 11.5);
        }
      })
      .save()
      .finally(() => {
        // Show the button again after download
        if (downloadButton) {
          downloadButton.style.display = "inline-block";
        }
      });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mt-10 mb-10 text-indigo-700">
        Attendance Report
      </h1>

      <div className="flex flex-wrap justify-center gap-8 mb-10">
        <form className="bg-white p-4 rounded-lg shadow-lg w-80">
          <h2 className="text-lg font-semibold mb-2">Class Filter</h2>
          <input
            type="number"
            placeholder="Start Year"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-2"
          />
          <input
            type="text"
            placeholder="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-2"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-4"
          />
          <button
            type="submit"
            onClick={handleSubmit("class")}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500"
          >
            Submit
          </button>
        </form>

        <form className="bg-white p-4 rounded-lg shadow-lg w-80">
          <h2 className="text-lg font-semibold mb-2">Roll Number Filter</h2>
          <input
            type="text"
            placeholder="Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-4"
          />
          <button
            type="submit"
            onClick={handleSubmit("roll")}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500"
          >
            Submit
          </button>
        </form>
      </div>

      {filteredData.length > 0 && (
        <div
          ref={reportRef}
          className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow"
        >
          <h3 className="text-xl font-semibold mb-4">Attendance Details</h3>

          {filterType === "class" && (
            <div className="mb-4">
              <p>
                <strong>Faculty:</strong> {filteredData[0]?.teachername || "N/A"}
              </p>
              <p>
                <strong>Branch:</strong> {branch.toUpperCase()}
              </p>
              <p>
                <strong>Start Year:</strong> {startYear}
              </p>
              {subject && (
                <p>
                  <strong>Subject:</strong> {subject.toUpperCase()}
                </p>
              )}
            </div>
          )}
          {filterType === "roll" && (
            <div className="mb-4">
              <p>
                <strong>Roll No:</strong> {rollNo}
              </p>
              <p>
                <strong>Name:</strong> {filteredData[0]?.studentname || "N/A"}
              </p>
              <p>
                <strong>Branch:</strong> {filteredData[0]?.branch || "N/A"}
              </p>
              <p>
                <strong>Year:</strong> {filteredData[0]?.start_year || "N/A"}
              </p>
            </div>
          )}

          {filterType === "roll" && (
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="px-4 py-2 border">Subject</th>
                  <th className="px-4 py-2 border">Faculty</th>
                  <th className="px-4 py-2 border">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="text-center border-b">
                    <td className="px-4 py-2 border">{item.subject}</td>
                    <td className="px-4 py-2 border">{item.teachername}</td>
                    <td className="px-4 py-2 border">
                      {item.attendancePercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {filterType === "class" && (
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="px-4 py-2 border">Roll No</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="text-center border-b">
                    <td className="px-4 py-2 border">{item.rollNo}</td>
                    <td className="px-4 py-2 border">{item.studentname}</td>
                    <td className="px-4 py-2 border">
                      {item.attendancePercentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="text-right mt-6">
            <button
              onClick={handleDownload}
              className="download-btn bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceFilter;

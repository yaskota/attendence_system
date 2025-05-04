import express from 'express'
import attendencemodel from '../models/attendence.js'
import studentmodel from '../models/student.js'
import teachermodel from '../models/teacher.js'

const isToday = (date) => {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

export const attend = async (req, res) => {
    const { rollNo, USER_ID, subject, branch, periods,startTime,endTime} = req.body;
    if (!rollNo || !USER_ID || !subject || !branch || !periods || !startTime ||!endTime) {
        return res.status(400).send({ message: "data is missing" });
    }

    try {

        const user = await studentmodel.findOne({ rollNo });
        if (!user) {
            return res.status(400).send({ message: "candidate not exist" });
        }
        if (user.branch !== branch) {
            return res.status(400).send({ message: "branch mismatch" });
        }

        const teach = await teachermodel.findById(USER_ID);
        if (!teach) {
            return res.status(401).send({ message: "teacher ID not exist" });
        }

        const year = user.start_year;
        const attend = await attendencemodel.findOne({ subject, start_year: year, branch ,startTime,endTime});

        if (!attend) {
            const students = await studentmodel.find({ start_year: year, branch });
            if (students.length === 0) {
                return res.status(404).send({ message: "no student start from the year" });
            }

            const studentattend = students.map(stud => ({
                rollNo: stud.rollNo,
                studentname: stud.name,
                teachername: teach.name,
                branch,
                start_year: year,
                subject,
                periods,
                startTime,
                endTime,
                totalhour: periods,
                subjectactive: true,
                timestamp: []  // Initialize empty array
            }));

            await attendencemodel.insertMany(studentattend);
        }

        const attend_dance = await attendencemodel.findOne({ rollNo, subject, start_year: year, branch ,startTime,endTime});
        if (!attend_dance) {
            return res.status(401).send({ message: "student not exist in the subject" });
        }

        if (attend_dance.subjectactive === false) {
            await attendencemodel.updateMany(
                { start_year: year, branch, subject ,startTime,endTime},
                { $set: { subjectactive: true }, $inc: { totalhour: periods } }
            );
        }

        await attendencemodel.updateOne(
            { rollNo, start_year: year, branch, subject ,startTime,endTime},
            {
                $inc: { counthour: periods },
                $push: { timestamp: new Date() }
            }
        );

        return res.status(201).send({ message: "attendance updated successfully" });

    } catch (error) {
        return res.status(500).send({ message: "error in student attendance", error });
    }
}


export const getattendToday = async (req, res) => {
    const { start_year, branch, subject, startTime, endTime } = req.body;
  
    console.log(start_year,branch,subject,startTime,endTime);
    if (!start_year || !branch || !subject || !startTime || !endTime) {

      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      const allData = await attendencemodel.find({
        start_year,
        branch,
        subject,
        startTime,
        endTime,
      });
  
      const todayAttendance = allData
        .map((student) => {
          const count = student.timestamp.filter((t) =>
            isToday(new Date(t))
          ).length;
  
          if (count > 0) {
            return {
                id:student._id,
              rollNo: student.rollNo,
              studentname: student.studentname,
              todayCount: count,
            };
          }
  
          return null;
        })
        .filter((item) => item !== null);
  
      return res.status(200).send(todayAttendance);
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
      return res
        .status(500)
        .json({ message: "Error fetching today's attendance" });
    }
  };

  export const Delete = async (req, res) => {
    const { periods } = req.body;
  
    try {
      const id = req.params.id;
      const user = await attendencemodel.findById(id);
    console.log(id,periods)
      if (!user) {
        return res.status(404).send({ message: "attendance record not found" });
      }
  
      const deleteHour = Number(periods);
      const currentCount = Number(user.counthour);
  
      if (isNaN(deleteHour) || deleteHour < 0) {
        return res.status(400).send({ message: "Invalid hour value" });
      }
  
      if (deleteHour > currentCount) {
        return res.status(400).send({ message: "hour to delete exceeds recorded hours" });
      }
  
      if (user.timestamp.length > 0) {
        user.timestamp.pop(); // You can pop multiple if needed based on `hour`
      }
  
      user.counthour = currentCount - deleteHour;
  
      await user.save();
  
      return res.status(200).send({ message: "attendance updated successfully" });
    } catch (error) {
      console.error("Error in delete:", error);
      return res.status(500).send({ message: "error in delete at attendance", error });
    }
  };
  


  export const completed = async (req, res) => {
    const { start_year, subject, branch, startTime, endTime } = req.body;
  
    if (!start_year || !subject || !branch || !startTime || !endTime) {
      return res.status(400).send({ message: "data missing" });
    }
  
    console.log(start_year, branch, subject, startTime, endTime);
  
    try {
      const user = await attendencemodel.find({ start_year, branch, subject, startTime, endTime });
      console.log(user);
  
      if (user.length === 0) {
        return res.status(400).send({ message: "no student attend" });
      }
  
      console.log("complete");
  
      await attendencemodel.updateMany(
        { start_year, branch, subject, startTime, endTime },
        { $set: { subjectactive: false } }
      );
  
      return res.status(200).send({ message: "attendance taking completed" });
    } catch (error) {
      console.error("Error in attendance completion:", error);
      return res.status(500).send({ message: "error in attendance completion" });
    }
  };
  

export const rollFilter=async(req,res)=>{
    const { rollNo } = req.body;

  try {
    const records = await attendencemodel.find({ rollNo });

    if (records.length === 0) {
      return res.status(404).json({ message: "No records found for this roll number." });
    }

    // Group by subject
    const subjectMap = {};

    records.forEach(record => {
      const { subject, counthour, totalhour, studentname, branch, start_year, teachername } = record;

      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          subject,
          counthour: 0,
          totalhour: 0,
          studentname,
          rollNo,
          branch,
          start_year,
          teachername
        };
      }

      subjectMap[subject].counthour += counthour;
      subjectMap[subject].totalhour += totalhour;
    });

    // Format result
    const result = Object.values(subjectMap).map(item => ({
      ...item,
      attendancePercentage: item.totalhour
        ? ((item.counthour / item.totalhour) * 100).toFixed(2)
        : "0.00"
    }));

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Server error." });
  }
}

export const attendencefilter=async(req,res)=>{
    const { start_year, subject, branch } = req.body;

  try {
    const records = await attendencemodel.find({
      start_year,
      subject,
      branch,
    });

    if (!records.length) {
      return res.status(404).json({ message: 'No records found' });
    }

    // Group by rollNo and accumulate hours
    const studentMap = {};

    records.forEach(record => {
      const { rollNo, studentname, totalhour, counthour ,teachername} = record;

      if (!studentMap[rollNo]) {
        studentMap[rollNo] = {
          rollNo,
          studentname,
          teachername,
          totalHour: 0,
          countHour: 0,
        };
      }

      studentMap[rollNo].totalHour += totalhour;
      studentMap[rollNo].countHour += counthour;
    });

    // Convert to array with attendance percentage
    const result = Object.values(studentMap).map(student => ({
      ...student,
      attendancePercentage: student.totalHour
        ? ((student.countHour / student.totalHour) * 100).toFixed(2)
        : '0.00',
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}
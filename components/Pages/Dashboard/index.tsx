import React from "react";
import style from "../../../styles/commonStyle.module.css";
import Avatar from "../../../public/Svg/dasboard_avatar.svg";
import Home from "../../../public/Svg/home.svg";
import Resume from "../../../public/Svg/resume.svg";
import JobMatch from "../../../public/Svg/job_match.svg";
import Interview from "../../../public/Svg/interview.svg";
import Skills from "../../../public/Svg/skills.svg";
import Back from "../../../public/Svg/back_metronic.svg";
import Flare from "../../../public/Svg/flare.svg";
import ArrowLeft from "../../../public/Svg/left_arrow.svg";
import ArrowRight from "../../../public/Svg/right_arrow.svg";
import KebabIcon from "../../../public/Svg/kebab.svg";
import MailBox from "../../../public/Svg/mail_box.svg";
import Notification from "../../../public/Svg/notification.svg";
import Calendar from "../../../public/Svg/calender_green.svg";
import Eye from "../../../public/Svg/eye.svg";
import Thumbnail from "../../../public/Svg/thumbnail_sample.png";
import Image from "next/image";
import clsx from "clsx";
import {BreadCrumb} from "primereact/breadcrumb";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard: React.FC = () => {
  const options = [
    {
      name: "Dashboard",
      icon: <Image src={Home} alt="home" width={20} height={20} />,
    },
    {
      name: "Resume Builder",
      icon: <Image src={Resume} alt="Resume Builder" width={20} height={20} />,
    },
    {
      name: "Job Matches",
      icon: <Image src={JobMatch} alt="Job Match" width={20} height={20} />,
    },
    {
      name: "Interview Practice",
      icon: (
        <Image src={Interview} alt="nterview Practice" width={20} height={20} />
      ),
    },
    {
      name: "Skills & Training",
      icon: (
        <Image src={Skills} alt="Skills & Training" width={20} height={20} />
      ),
    },
    {
      name: "Assignments",
      icon: <Image src={Resume} alt="Assignments" width={20} height={20} />,
    },
    {
      name: "Notifications",
      icon: <Image src={JobMatch} alt="Notifications" width={20} height={20} />,
    },
    {
      name: "Settings",
      icon: <Image src={Interview} alt="Settings" width={20} height={20} />,
    },
  ];
  const items = [{label: "Dashboard"}];
  const home = {
    icon: () => <Image src={Home} alt="home" width={20} height={20} />,
  };
  const mockRow = [
    {
      name: "Safety Procedure Quiz",
      class: "Introduction to HVAC",
      date: "05/21/25 03:30 PM",
      action: "view",
    },
    {
      name: "HVAC Systems Overview",
      class: "Basic Electricity for HVAC",
      date: "05/21/25 03:30 PM",
      action: "view",
    },
    {
      name: "Safety Procedure Quiz",
      class: "Introduction to HVAC",
      date: "05/21/25 03:30 PM",
      action: "view",
    },
  ];
  const actionTemplate = () => {
    return (
      <>
        <Image src={Eye} alt="eye" />
      </>
    );
  };
  const mockColumn = [
    {header: "Assignment Name", field: "name"},
    {header: "Class", field: "class"},
    {header: "Due", field: "date"},
    {header: "Action", field: "action", body: actionTemplate},
  ];
  const tableHeader = () => {
    return (
      <div className={clsx("flex justify-content-between", style.tableHead)}>
        <h3>Pending Assignments</h3>
        <p className="font-semibold">
          Total Assignment Due: <span className="font-bold">12</span>
        </p>
      </div>
    );
  };

  const JobRoleCard = ({
    role,
    salary,
    employmentType,
    location,
  }: {
    role: string;
    salary: string;
    employmentType: string;
    location: string;
  }) => (
    <div className={clsx("flex gap-3 p-3", style.pageCard)}>
      <Image src={Flare} alt="flare" />
      <div className="flex flex-column gap-1">
        <h3 className={clsx("text-base", style.normalText)}>{role}</h3>
        <p className={clsx("text-sm", style.lightText)}>{salary}</p>
        <div className="flex gap-2">
          <span className={clsx("px-2 py-1", style.statusYellow)}>
            {employmentType}
          </span>
          <span className={clsx("px-2 py-1", style.statusYellow)}>
            {location}
          </span>
        </div>
      </div>
      <Image src={KebabIcon} alt="kebab" />
    </div>
  );

  const Tab = ({title, active}: {title: string; active: boolean}) => {
    return (
      <span className={clsx(style.tab, active && style.activeTab)}>
        {title}
      </span>
    );
  };
  const CourseCard = ({
    courseTitle,
    courseDescription,
    user,
  }: {
    courseTitle: string;
    courseDescription: string;
    user: string;
  }) => {
    return (
      <div className={clsx("p-4", style.pageCard)}>
        <Image src={Thumbnail} alt={courseTitle} />
        <div className="flex flex-column gap-1 mt-4">
          <h3 className={style.normalText}>{courseTitle}</h3>
          <p className={style.blueText}>{user}</p>
          <p className={style.normalText}>{courseDescription}</p>
        </div>
      </div>
    );
  };

  const rawData = [
    {name: "Electrical Systems", blue: 30},
    {name: "Refrigiration Cycle", blue: 20},
    {name: "Thermostat Installation", blue: 5},
  ];
  const data = rawData.map((item) => ({
    name: item.name,
    part1: item.blue * 0.5, // first half (gradient)
    part2: item.blue * 0.5, // second half (solid)
  }));

  const SimpleBarChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{top: 20, right: 30, left: 40, bottom: 5}}
        >
          <defs>
            <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0099FF" />
              <stop offset="100%" stopColor="#00FFFF" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            tick={{fill: "#252B41E5", fontSize: 14, fontWeight: 400}}
          />
          <Tooltip />
          <Bar
            dataKey="part1"
            stackId="a"
            fill="url(#gradient1)"
            barSize={20}
          />
          <Bar dataKey="part2" stackId="a" fill="#1B84FF" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  return (
    <div className="flex">
      <div className={style.dashboardLeft}>
        <Image src={Avatar} alt="avatar" />
        <div className="mt-4 flex flex-column gap-4">
          {options.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 mb-2 text-sm text-gray-800"
            >
              {item.icon}
              <span className={clsx("text-base", style.normalText)}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="pl-4 w-full">
        {/* header */}
        <div className="flex gap-2 align-items-center">
          <Image src={Back} alt="back" />
          <div className="flex flex-column gap-1">
            <h3 className={clsx("ml-2", style.normalText)}>Dashboard</h3>
            <BreadCrumb
              className="border-none breadcrumb-list custom-breadcrumb"
              model={items}
              home={home}
              // separatorIcon={<Image src={ArrowRight} alt="seperator" />}
              separatorIcon={<i className="pi pi-angle-right"></i>}
            />
          </div>
        </div>

        {/* body */}
        <div className="flex gap-4 flex-column">
          {/* firstpart */}
          <div className="flex gap-4 mt-4">
            <div className={style.pageCard} style={{width: "80%"}}>
              <h3 className={clsx("text-lg", style.headCard)}>
                Job Opportunities
              </h3>

              <div className="flex  p-5 align-items-center justify-content-around">
                <Image
                  src={ArrowLeft}
                  alt="left_arrow"
                  className="cursor-pointer"
                />
                <JobRoleCard
                  role="HVAC Technician"
                  salary="$2,000 - 5,000 / Monthly"
                  employmentType="Full Time"
                  location="Glendale,Arizona"
                />
                <JobRoleCard
                  role="HVAC Technician"
                  salary="$2,000 - 5,000 / Monthly"
                  employmentType="Full Time"
                  location="Glendale,Arizona"
                />
                <JobRoleCard
                  role="HVAC Technician"
                  salary="$2,000 - 5,000 / Monthly"
                  employmentType="Full Time"
                  location="Glendale,Arizona"
                />
                <Image
                  src={ArrowRight}
                  alt="right_arrow"
                  className="cursor-pointer"
                />
              </div>
            </div>
            <div
              className={clsx("flex flex-column gap-4 p-5", style.pageCard)}
              style={{width: "20%"}}
            >
              <div className="flex gap-4 justify-content-between">
                <Image src={MailBox} alt="mail_box" />
                <Image src={Notification} alt="notification" />
              </div>
              <div className={clsx("flex p-2", style.statusGreen)}>
                <Image src={Calendar} alt="calendar" />
                <div className="flex flex-column">
                  <h3 className={clsx("text-base", style.blueLightText)}>
                    Assignment Due
                  </h3>
                  <h2 className={style.normalText}>3</h2>
                </div>
              </div>
            </div>
          </div>
          {/* second part */}
          <div className="flex gap-4">
            <DataTable
              header={tableHeader()}
              value={mockRow}
              showGridlines
              className="custom-table"
              style={{width: "60%"}}
            >
              {mockColumn.map((col, index) => (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                />
              ))}
            </DataTable>
            <div className={clsx("p-3", style.pageCard)} style={{width: "40%"}}>
              <div className="flex justify-content-between">
                <div
                  style={{display: "flex", alignItems: "center", gap: "8px"}}
                >
                  <span className={style.circleOuter}>
                    <span className={style.circleInner}></span>
                  </span>
                  <span className={clsx("text-sm font-bold", style.normalText)}>
                    Current Level
                  </span>
                </div>
                <div
                  style={{display: "flex", alignItems: "center", gap: "8px"}}
                >
                  <span className={style.circleOuter}>
                    <span className={style.circleInner}></span>
                  </span>
                  <span className={clsx("text-sm font-bold", style.normalText)}>
                    Recommended Level
                  </span>
                </div>
              </div>
              <SimpleBarChart />
            </div>
          </div>
          {/* third part */}
          <div className="flex flex-column gap-4">
            <div
              className={clsx("flex gap-4", style.tabContainer)}
              style={{height: "2.5rem"}}
            >
              <Tab title="Recommended Course" active={true} />
            </div>
            <div className="flex gap-4">
              <CourseCard
                courseTitle="HVAC Basics"
                courseDescription="Learn the fundamentals of HVAC systems."
                user="Steve H"
              />
              <CourseCard
                courseTitle="HVAC Basics"
                courseDescription="Learn the fundamentals of HVAC systems."
                user="Steve H"
              />
              <CourseCard
                courseTitle="HVAC Basics"
                courseDescription="Learn the fundamentals of HVAC systems."
                user="Steve H"
              />
              <CourseCard
                courseTitle="HVAC Basics"
                courseDescription="Learn the fundamentals of HVAC systems."
                user="Steve H"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

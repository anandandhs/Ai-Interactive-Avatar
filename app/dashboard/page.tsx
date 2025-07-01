"use client";
import React from "react";
import style from "../../styles/commonStyle.module.css";
import Avatar from "../../public/Svg/dasboard_avatar.svg";
import Home from "../../public/Svg/home.svg";
import Resume from "../../public/Svg/resume.svg";
import JobMatch from "../../public/Svg/job_match.svg";
import Interview from "../../public/Svg/interview.svg";
import Skills from "../../public/Svg/skills.svg";
import Back from "../../public/Svg/back_metronic.svg";
import Flare from "../../public/Svg/flare.svg";
import ArrowLeft from "../../public/Svg/left_arrow.svg";
import ArrowRight from "../../public/Svg/right_arrow.svg";
import KebabIcon from "../../public/Svg/kebab.svg";
import MailBox from "../../public/Svg/mail_box.svg";
import Notification from "../../public/Svg/notification.svg";
import Calendar from "../../public/Svg/calender_green.svg";
import Eye from "../../public/Svg/eye.svg";
import Thumbnail from "../../public/Svg/thumbnail_sample.png";
import Image from "next/image";
import clsx from "clsx";
import AppBreadCrumb from "@/components/AppBreadCrumb/AppBreadCrumb";
import AssignmentTable from "@/components/AssignmentTable/AssignmentTable";
import SimpleBarChart from "@/components/SimpleChart/SimpleChart";
import NavBar from "@/components/NavBar";

export default function Dashboard() {
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
  const items = [{ label: "Dasshboard", id: "dashboard", url: "/dashboard" }];
  const home = {
    icon: <Image src={Home} alt="home" width={20} height={20} />,
    url: "/",
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
          <span
            className={clsx("px-2 py-1", style.statusYellow)}
            style={{ width: "4vw" }}
          >
            {employmentType}
          </span>
          <span
            className={clsx("px-2 py-1", style.statusYellow)}
            style={{ width: "5vw" }}
          >
            {location}
          </span>
        </div>
      </div>
      <Image src={KebabIcon} alt="kebab" />
    </div>
  );

  const Tab = ({ title, active }: { title: string; active: boolean }) => {
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

  return (
    <>
      <NavBar
        isAuthenticated={true}
        dashboardSwitch={true}
        setDashboardSwitch={() => {}}
      />
      <div
        className="flex-1 overflow-y-scroll"
        style={{
          backgroundColor: "var(--bg-primary)",
          padding: "var(--space-6) var(--space-8)",
          height: "calc(100vh - 5rem)", // Account for navbar
          maxHeight: "calc(100vh - 5rem)",
        }}
      >
        <div
          className="w-full h-full flex flex-column"
          style={{
            backgroundColor: "var(--bg-secondary)",
            height: "100%",
            maxHeight: "100%",
          }}
        >
          <div
            className="w-full max-w-7xl flex flex-column mx-auto h-full"
            style={{
              height: "100%",
              maxHeight: "100%",
            }}
          >
            <div
              className="w-full h-full"
              style={{ height: "100%", maxHeight: "100%" }}
            ></div>
            <div className="flex">
              <div className={style.dashboardLeft}>
                <Image src={Avatar} alt="avatar" />
                <div className="mt-4 flex flex-column gap-4">
                  {options.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 mb-2 text-sm text-gray-800"
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
                    <h3 className={clsx("ml-2", style.normalText)}>
                      Dashboard
                    </h3>
                    <AppBreadCrumb model={items} home={home} />
                  </div>
                </div>

                {/* body */}
                <div className="flex gap-4 flex-column">
                  {/* firstpart */}
                  <div className="flex gap-4 mt-4">
                    <div className={style.pageCard} style={{ width: "75%" }}>
                      <h3 className={style.headCard}>Job Opportunities</h3>

                      <div className="flex gap-3 p-5 align-items-center">
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
                      className={clsx(
                        "flex flex-column gap-4 p-5",
                        style.pageCard
                      )}
                      style={{ width: "25%" }}
                    >
                      <div className="flex gap-4 justify-content-between">
                        <Image src={MailBox} alt="mail_box" />
                        <Image src={Notification} alt="notification" />
                      </div>
                      <div className={clsx("flex p-3", style.statusGreen)}>
                        <Image src={Calendar} alt="calendar" />
                        <div className="flex flex-column">
                          <h3 className={style.blueLightText}>
                            Assignment Due
                          </h3>
                          <h2 className={clsx("", style.normalText)}>3</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* second part */}
                  <div className="flex gap-4">
                    <AssignmentTable></AssignmentTable>
                    <div
                      className={clsx("p-3", style.pageCard)}
                      style={{ width: "40%" }}
                    >
                      <SimpleBarChart />
                    </div>
                  </div>
                  {/* third part */}
                  <div className="flex flex-column gap-4">
                    <div
                      className={clsx("flex gap-4", style.tabContainer)}
                      style={{ height: "2.5rem" }}
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
          </div>
        </div>
      </div>
    </>
  );
}

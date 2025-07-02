"use client";
import React from "react";
import style from "../../styles/commonStyle.module.css";
import Avatar from "../../public/Svg/dasboard_avatar.svg";
import Home from "../../public/Svg/home.svg";
import Resume from "../../public/Svg/resume.svg";
import JobMatch from "../../public/Svg/job_match.svg";
import Interview from "../../public/Svg/interview.svg";
import Skills from "../../public/Svg/skills.svg";
import Back from "../../public/Svg/back_icon.svg";
import Logo1 from "../../public/Svg/job_logo_1.svg";
import Logo2 from "../../public/Svg/job_logo_2.svg";
import Logo3 from "../../public/Svg/job_logo_3.svg";
import ArrowLeft from "../../public/Svg/left_arrow.svg";
import ArrowRight from "../../public/Svg/right_arrow.svg";
import StarIcon from "../../public/Svg/yellow_star.svg";
import MailBox from "../../public/Svg/mail_box.svg";
import Notification from "../../public/Svg/notification.svg";
import Calendar from "../../public/Svg/calender_green.svg";
import Eye from "../../public/Svg/eye.svg";
import Thumbnail from "../../public/Svg/thumbnail_sample.png";
import Image from "next/image";
import type {StaticImageData} from "next/image";

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
  const items = [{label: "Dasshboard", id: "dashboard", url: "/dashboard"}];
  const home = {
    icon: <Image src={Home} alt="home" width={20} height={20} />,
    url: "/",
  };

  const JobRoleCard = ({
    role,
    salary,
    employmentType,
    location,
    logo,
  }: {
    role: string;
    salary: string;
    employmentType: string;
    location: string;
    logo: StaticImageData;
  }) => (
    <div
      className={clsx("flex flex-column gap-3 p-5", style.pageCard)}
      style={{width: "15vw"}}
    >
      <div className="flex justify-content-between">
        <Image src={logo} alt="logo" />
        <Image src={StarIcon} alt="star" />
      </div>
      <div className="flex flex-column gap-2">
        <h3 className={clsx("text-base", style.normalText)}>{role}</h3>
        <p className={clsx("text-sm", style.lightText)}>{salary}</p>
        <div className="flex gap-2">
          <span className={clsx("px-2 py-1", style.yellowStatus)}>
            {employmentType}
          </span>
          <span className={clsx("px-2 py-1", style.yellowStatus)}>
            {location}
          </span>
        </div>
      </div>
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
      <div className={style.pageCard}>
        <div className="inline-block relative">
          <Image src={Thumbnail} alt={courseTitle} />

          <span className={style.imageOverlayText}>HVAC Installation</span>
        </div>

        <div
          className="flex flex-column gap-1 p-4 pb-5"
          style={{width: "18vw"}}
        >
          <h3 className={style.normalText}>{courseTitle}</h3>
          <p className={style.blueText}>{user}</p>
          <p className={style.normalText}>{courseDescription}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* <div
        className="flex-1 overflow-y-scroll"
        style={{
          backgroundColor: "var(--bg-primary)",
          padding: "var(--space-6) var(--space-8)",
          height: "calc(100vh - 5rem)", // Account for navbar
          maxHeight: "calc(100vh - 5rem)",
        }}
      > */}
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
            style={{height: "100%", maxHeight: "100%"}}
          ></div>
          <div className="flex">
            <div className={clsx("pr-4", style.dashboardLeft)}>
              <Image src={Avatar} alt="avatar" />
              <div className="mt-4 flex flex-column gap-4">
                {options.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 mb-2">
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
                  <AppBreadCrumb items={items} home={home} />
                </div>
              </div>

              {/* body */}
              <div className="flex gap-4 flex-column">
                {/* firstpart */}
                <div className="flex gap-4 mt-4">
                  <div
                    className={clsx("flex  gap-4 p-5", style.pageCard)}
                    style={{width: "40%"}}
                  >
                    <div className={clsx("flex p-4", style.statusGreen)}>
                      <div className="flex flex-column">
                        <Image src={Calendar} alt="calendar" />
                        <h3
                          className={clsx(
                            "text-base mt-4",
                            style.blueLightText
                          )}
                        >
                          Assignment Due
                        </h3>
                        <h2 className={style.normalText}>3</h2>
                      </div>
                    </div>
                    <div className="flex flex-column gap-4 justify-content-between">
                      <div
                        className={clsx(
                          "flex align-items-center gap-3 px-3 py-4",
                          style.statusYellow
                        )}
                      >
                        <Image src={Notification} alt="notification" />
                        <div className="flex flex-column">
                          <h3
                            className={clsx("text-base", style.blueLightText)}
                          >
                            Notification Enabled
                          </h3>
                          <h3 className={style.normalText}>Yes</h3>
                        </div>
                      </div>
                      <div
                        className={clsx(
                          "flex align-items-center gap-3 px-3 py-4",
                          style.statusBlue
                        )}
                      >
                        <Image src={MailBox} alt="mail_box" />
                        <div className="flex flex-column">
                          <h3
                            className={clsx("text-base", style.blueLightText)}
                          >
                            New Jobs listed
                          </h3>
                          <h2 className={style.normalText}>10</h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex flex-column gap-4"
                    style={{width: "60%"}}
                  >
                    <div className="flex justify-content-between">
                      <h3 className={clsx("text-base", style.normalText)}>
                        Job Opportunities
                      </h3>
                      <p className={style.blueText}>View More</p>
                    </div>
                    <div className="flex gap-4">
                      <JobRoleCard
                        role="HVAC Technician"
                        salary="$2,000 - 5,000 / Monthly"
                        employmentType="Full Time"
                        location="Glendale,Arizona"
                        logo={Logo1}
                      />
                      <JobRoleCard
                        role="HVAC Technician"
                        salary="$2,000 - 5,000 / Monthly"
                        employmentType="Full Time"
                        location="Glendale,Arizona"
                        logo={Logo2}
                      />
                      <JobRoleCard
                        role="HVAC Technician"
                        salary="$2,000 - 5,000 / Monthly"
                        employmentType="Full Time"
                        location="Glendale,Arizona"
                        logo={Logo3}
                      />
                    </div>
                  </div>
                </div>
                {/* second part */}
                <div className="flex gap-4">
                  <AssignmentTable></AssignmentTable>
                  <div
                    className={clsx("p-3", style.pageCard)}
                    style={{width: "40%"}}
                  >
                    <div className="flex justify-content-between">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span className={style.circleOuterGray}>
                          <span className={style.circleInner}></span>
                        </span>
                        <span
                          className={clsx(
                            "text-sm font-bold",
                            style.normalText
                          )}
                        >
                          Current Level
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span className={style.circleOuterBlue}>
                          <span className={style.circleInner}></span>
                        </span>
                        <span
                          className={clsx(
                            "text-sm font-bold",
                            style.normalText
                          )}
                        >
                          Recommended Level
                        </span>
                      </div>
                    </div>
                    <SimpleBarChart />
                  </div>
                </div>
                {/* third part */}
                <div className="flex flex-column gap-4 mb-5">
                  <div className="flex justify-content-between">
                    <h3 className={clsx("text-base", style.normalText)}>
                      Recommended Courses
                    </h3>
                    <p className={style.blueText}>View More</p>
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
      {/* </div> */}
    </>
  );
}

import {
  AiFillHome,
  AiOutlineTeam,
  AiOutlineUserAdd,
  AiOutlineAppstoreAdd,
} from "react-icons/ai";
import {
  IoIosPaper,
  IoMdBriefcase,
  IoIosPeople,
  IoIosAddCircleOutline,
} from "react-icons/io";
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiSettings3Line,
} from "react-icons/ri";
import { FaChartLine } from "react-icons/fa";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/",
    icon: <AiFillHome />,
    tooltip: "Overview of the system",
  },
  {
    title: "Departments",
    path: "/departments",
    icon: <IoMdBriefcase />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    tooltip: "Manage company departments",
    subNav: [
      {
        title: "All Departments",
        path: "/departments",
        icon: <IoIosPaper />,
      },
      {
        title: "Create Department",
        path: "/departments/create",
        icon: <IoIosAddCircleOutline />,
      },
    ],
  },
  {
    title: "Employees",
    path: "/employees",
    icon: <IoIosPeople />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    tooltip: "Manage all employees",
    subNav: [
      {
        title: "All Employees",
        path: "/employees",
        icon: <IoIosPaper />,
      },
      {
        title: "Add New Employee",
        path: "/employees/create",
        icon: <AiOutlineUserAdd />,
      },
    ],
  },
  {
    title: "Performance",
    path: "/performance",
    icon: <FaChartLine />,
    tooltip: "View analytics and reports",
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <RiSettings3Line />,
    tooltip: "System configuration and preferences",
  },
];

"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/themeToggle";
import UserDropdown from "@/components/userDropdown";

import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { User } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { QuizCategory } from "@prisma/client";

const support = [
  {
    name: "Discord",
    icon: <DiscordLogoIcon />,
    link: "https://discord.gg/BExQ86z8",
  },
  {
    name: "GitHub",
    icon: <GitHubLogoIcon />,
    link: "https://github.com/RocketPLN",
  },
];

function Navbar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (pathname === "/auth") return null;

  return (
    <div className="mb-2 sticky top-0 z-50 bg-background/80">
      <div className="p-2 flex justify-center w-screen">
        <div className="flex md:justify-around justify-center w-[80%]">
          <h1 className="md:flex hidden justify-start items-center text-lg">
            <Link href="/">Quiz App</Link>
          </h1>
          <NavigationMenu className="text-muted-foreground">
            <NavigationMenuList className="grid grid-cols-1 gap-2 place-items-center md:flex">
              <NavigationMenuItem>
                <Link href="/#about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Quizzes</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuList className="p-4 grid grid-cols-2 gap-2 w-max place-items-center">
                    <NavigationMenuItem className="col-span-2 text-foreground text-xl font-semibold">
                      Select Category
                    </NavigationMenuItem>
                    {Object.values(QuizCategory).map((category) => (
                      <NavigationMenuLink
                        key={category}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-accent w-fit"
                        href={`/quiz/?category=${category.toLocaleLowerCase()}`}
                      >
                        {category.at(0) + category.toLocaleLowerCase().slice(1)}
                      </NavigationMenuLink>
                    ))}
                    <NavigationMenuLink
                      href="/quiz"
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent w-fit"
                    >
                      All
                    </NavigationMenuLink>
                  </NavigationMenuList>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Support</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuList className="p-4 flex flex-col justify-center items-center gap-2 w-full">
                    {support.map((support) => (
                      <Link
                        href={support.link}
                        key={support.name}
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                          {support.name} {support.icon}
                        </NavigationMenuLink>
                      </Link>
                    ))}
                  </NavigationMenuList>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <h1 className="flex flex-end items-center gap-2">
            {!user ? (
              <Button
                onClick={() => router.push("/auth")}
                variant="secondary"
                className={cn(
                  scrolled
                    ? "hover:bg-primary bg-primary/75"
                    : "hover:bg-primary",
                  "transition-all duration-500 text-lg"
                )}
              >
                Login
              </Button>
            ) : (
              <UserDropdown user={user} />
            )}
            <div className="hidden md:block">
              <ModeToggle />
            </div>
          </h1>
        </div>
      </div>
      <div className="flex justify-center">
        <Separator orientation="horizontal" className="w-4/6" />
      </div>
    </div>
  );
}

export default Navbar;

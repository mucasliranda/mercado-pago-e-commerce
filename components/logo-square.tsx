import clsx from "clsx";
import { getTranslations } from "lib/i18n/server";
import LogoIcon from "./icons/logo";

export default async function LogoSquare({
  size,
}: {
  size?: "sm" | undefined;
}) {
  const { t } = await getTranslations();

  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black",
        {
          "h-[40px] w-[40px] rounded-xl": !size,
          "h-[30px] w-[30px] rounded-lg": size === "sm",
        },
      )}
    >
      <LogoIcon
        label={`${process.env.SITE_NAME} ${t("site.logoLabel")}`}
        className={clsx({
          "h-[16px] w-[16px]": !size,
          "h-[10px] w-[10px]": size === "sm",
        })}
      />
    </div>
  );
}

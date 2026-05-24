import { Suspense } from "react";
import { getTranslations } from "./i18n";
import Nav         from "./components/nav";
import Hero        from "./components/hero";
import About       from "./components/about";
import EpitechStats from "./components/epitech-stats";
import Skills      from "./components/skills";
import Projects    from "./components/projects";
import Contact     from "./components/contact";
import Footer      from "./components/footer";
import ScrollHint  from "./components/scroll-hint";
import PageLoading from "./components/page-loading";

export default async function Portfolio() {
  const { t, locale } = await getTranslations();

  return (
    <div className="bg-ctp-base text-ctp-text">
      <Suspense fallback={<PageLoading t={t} />}>
        <div style={{ animation: "page-fade-in 0.5s ease both" }}>
          <Nav          t={t.nav}      locale={locale} />
          <Hero         t={t.hero}     />
          <About        t={t.about}    />
          <Skills       t={t.skills}   />
          <Projects     t={t.projects} />
          <EpitechStats t={t.epitech}  />
          <Contact      t={t.contact}  />
          <Footer       t={t.footer}   />
        </div>
      </Suspense>
      <ScrollHint />
    </div>
  );
}

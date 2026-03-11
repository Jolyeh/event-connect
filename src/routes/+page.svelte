<script>
    import Footer from "$lib/components/layout/Footer.svelte";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import CategoriesGrid from "$lib/sections/CategoriesGrid.svelte";
    import EventsGrid from "$lib/sections/EventsGrid.svelte";
    import Hero from "$lib/sections/Hero.svelte";
    import HowItWorks from "$lib/sections/HowItWorks.svelte";
    import Newsletter from "$lib/sections/Newsletter.svelte";
    import OrganizerCTA from "$lib/sections/OrganizerCTA.svelte";
    import ScrollingTicker from "$lib/sections/ScrollingTicker.svelte";
    import StatsBar from "$lib/sections/StatsBar.svelte";
    import Testimonials from "$lib/sections/Testimonials.svelte";
</script>

<main class="min-h-screen">
    <Navbar />
    <Hero />
    <StatsBar />
    <ScrollingTicker />
    <EventsGrid />
    <CategoriesGrid />
    <HowItWorks />
    <Testimonials />
    <OrganizerCTA />
    <Newsletter />
    <Footer />
</main>

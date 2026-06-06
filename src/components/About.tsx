import developersData from '../data/developers.json'
import DeveloperProfileCard from './DeveloperProfileCard'
import Screen from './Screen'

const developers = developersData as Array<{
    initials: string
    name: string
    title: string
    detail: string
    specialties: string[]
    focus: string
}>

export default function About() {
    return (
        <Screen title="About" subtitle="Developer experience overview.">
            <p>This team brings together frontend craftsmanship and full-stack delivery for modern web projects.</p>

            {developers.map((developer) => (
                <DeveloperProfileCard key={developer.name} developer={developer} />
            ))}
        </Screen>
    )
}

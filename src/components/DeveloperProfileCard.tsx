type DeveloperProfile = {
  initials: string
  name: string
  title: string
  detail: string
  specialties: string[]
  focus: string
}

interface DeveloperProfileCardProps {
  developer: DeveloperProfile
}

export default function DeveloperProfileCard({ developer }: DeveloperProfileCardProps) {
  return (
    <section className="developer-profile-card">
      <div className="developer-profile-avatar" aria-label={`${developer.name} avatar`}>
        {developer.initials}
      </div>

      <div className="developer-profile-copy">
        <div className="developer-profile-heading">
          <h2>{developer.name}</h2>
          <p className="developer-profile-title">{developer.title}</p>
        </div>

        <p className="developer-profile-detail">{developer.detail}</p>
        <p className="developer-profile-focus"><strong>Professional focus:</strong> {developer.focus}</p>
        <p className="developer-profile-specialties"><strong>Core specialties:</strong></p>
        <ul className="developer-profile-specialties-list">
          {developer.specialties.map((specialty) => (
            <li key={specialty}>{specialty}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

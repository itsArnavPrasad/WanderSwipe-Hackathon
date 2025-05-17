interface StatsPanelProps {
  savedDestinations: Array<{
    name: string;
    country: string;
    tags: string[];
  }>;
}

export const StatsPanel = ({ savedDestinations }: StatsPanelProps) => {
  const topTags = savedDestinations
    .flatMap(dest => dest.tags)
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedTags = Object.entries(topTags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topCountries = savedDestinations
    .reduce((acc, dest) => {
      acc[dest.country] = (acc[dest.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const sortedCountries = Object.entries(topCountries)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="card space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Travel Stats</h3>
        <p className="text-text-secondary">
          {savedDestinations.length} destination{savedDestinations.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {savedDestinations.length > 0 && (
        <>
          <div>
            <h4 className="font-medium mb-2">Top Travel Interests</h4>
            <div className="flex flex-wrap gap-2">
              {sortedTags.map(([tag, count]) => (
                <div
                  key={tag}
                  className="px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-sm"
                >
                  {tag} ({count})
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Most Saved Countries</h4>
            <div className="space-y-2">
              {sortedCountries.map(([country, count]) => (
                <div
                  key={country}
                  className="flex justify-between items-center text-text-secondary"
                >
                  <span>{country}</span>
                  <span className="text-accent-primary font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {savedDestinations.length === 0 && (
        <div className="text-center text-text-secondary py-4">
          Start swiping to see your travel stats!
        </div>
      )}
    </div>
  );
}; 
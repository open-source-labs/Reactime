import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  CogIcon,
  LockClosedIcon,
  ServerIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Push to Deploy',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL Certificates',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: LockClosedIcon,
  },
  {
    name: 'Simple Queues',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Advanced Security',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Powerful API',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: CogIcon,
  },
  {
    name: 'Database Backups',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ServerIcon,
  },
]

export default function FeaturesSection() {
  return (
    <div className="relative bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
        <h2 className="text-lg font-semibold text-indigo-600">Deploy faster</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Everything you need to deploy your app
        </p>
        <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
          Phasellus lorem quam molestie id quisque diam aenean nulla in. Accumsan in quis quis nunc, ullamcorper
          malesuada. Eleifend condimentum id viverra nulla.
        </p>
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-xl bg-indigo-500 p-3 shadow-lg">
                        <feature.icon className="h-8 w-8 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base leading-7 text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

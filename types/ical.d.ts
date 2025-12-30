declare module 'ical.js' {
  export interface ICALTime {
    toJSDate(): Date
    year: number
    month: number
    day: number
    hour: number
    minute: number
  }

  export class Component {
    constructor(jCal: any[])
    getAllSubcomponents(name: string): Component[]
  }

  export class Event {
    constructor(component: Component)
    summary?: string
    description?: string
    startDate: ICALTime
    endDate: ICALTime
  }

  export function parse(input: string): any[]

  interface ICAL {
    parse: typeof parse
    Component: typeof Component
    Event: typeof Event
  }

  const ICAL: ICAL
  export default ICAL
}


export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}


export function formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num)
  }
  
  export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date)
  }
  

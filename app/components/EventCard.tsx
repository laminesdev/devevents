import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Props {
  title: string;
  image: string;
  slug: string;
  date: string;
  time: string;
  location?: string;
}

const EventCard = ({ title, image, slug, date, time, location }: Props) => {
  return (
    <Link
      href={`/events/${slug}`}
      className="block relative rounded-lg overflow-hidden"
    >
      {/* Event Image */}
      <div className="relative w-full h-[200px] md:h-[250px]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Always-visible Blur + Description */}
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center text-sm space-x-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {time}
            </span>
          </div>
          {location && (
            <div className="flex items-center text-sm gap-1">
              <MapPin className="w-4 h-4" />
              {location}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

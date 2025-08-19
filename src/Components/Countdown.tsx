import React, { useEffect, useState } from 'react';
import moment from 'moment';
import './Countdown.css';

type CountdownProps = {
  timeTillDate: string;  
  timeFormat: string; 
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const Countdown: React.FC<CountdownProps> = ({ timeTillDate, timeFormat }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const then = moment(timeTillDate, timeFormat);
      const now = moment();
      const duration = moment.duration(then.diff(now));

      setTimeLeft({
        days: Math.max(Math.floor(duration.asDays()), 0), // total days
        hours: Math.max(duration.hours(), 0),            // remainder hours
        minutes: Math.max(duration.minutes(), 0),        // remainder minutes
        seconds: Math.max(duration.seconds(), 0),        // remainder seconds
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeTillDate, timeFormat]);

  const { days, hours, minutes, seconds } = timeLeft;

  // Calculate the arc radius for each part
  const daysRadius = mapNumber(days, 30, 0, 0, 360);    
  const hoursRadius = mapNumber(hours, 24, 0, 0, 360);
  const minutesRadius = mapNumber(minutes, 60, 0, 0, 360);
  const secondsRadius = mapNumber(seconds, 60, 0, 0, 360);
  return (
    <div className="countdown-wrapper">
      {days >= 0 && (
        <div className="countdown-item">
          <SVGCircle radius={daysRadius} />
          {days}
          <span>days</span>
        </div>
      )}
      <div className="countdown-item">
        <SVGCircle radius={hoursRadius} />
        {hours}
        <span>hours</span>
      </div>
      <div className="countdown-item">
        <SVGCircle radius={minutesRadius} />
        {minutes}
        <span>minutes</span>
      </div>
      <div className="countdown-item">
        <SVGCircle radius={secondsRadius} />
        {seconds}
        <span>seconds</span>
      </div>
    </div>
  );
};

type SVGCircleProps = {
  radius: number;
};

const SVGCircle: React.FC<SVGCircleProps> = ({ radius }) => (
  <svg className="countdown-svg" width="100" height="100">
    <path
      fill="none"
      stroke="#243e5a"
      strokeWidth={4}
      d={describeArc(50, 50, 48, 0, radius)}
    />
  </svg>
);

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return ['M', start.x, start.y, 'A',
    radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

function mapNumber(
  number: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) {
  return ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export default Countdown;
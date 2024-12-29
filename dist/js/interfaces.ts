interface DogData {
    x: number;
    y: number;
    direction: number;
}

interface SheepData {
    x: number;
    y: number;
    direction: number;
    isLamb: boolean;
}

interface Snapshot {
    dog: DogData;
    sheep: SheepData[];   
}

interface QuadrantType {
    name: string;
    min: number;
    max: number;
}

interface Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Level {
    id: number;
    sheep: number;
    time: number;
    level_url: string;
    obstacles: Obstacle[];
}
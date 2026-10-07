interface ShutdownOptions {
    remote: {
        terminateSession(): Promise<void>;
        close(): Promise<void>;
    };
    stdio: {
        close(): Promise<void>;
    };
    drain: () => Promise<unknown>;
    log: (message: string) => void;
    exit: (code: number) => void;
    terminationTimeoutMs?: number;
    closeTimeoutMs?: number;
}
/** One shutdown for EOF, signals and transport closure, including reentrant callbacks. */
export declare function createShutdown({ remote, stdio, drain, log, exit, terminationTimeoutMs, closeTimeoutMs, }: ShutdownOptions): (exitCode?: number) => Promise<void>;
export {};

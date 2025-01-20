<?php
/**
 * ログ
 */
class Config {
    const IS_LOGFILE = true; // ログファイル出力フラグ true=出力あり/false=なし
    const LOG_LEVEL = 3; // ログレベル 0=ERROR/1=WARN/2=INFO/3=DEBUG
    const LOGDIR_PATH = '../../cache/'; // ログファイル出力ディレクトリ
    // const LOGFILE_NAME = $fileName; // ログファイル名
    const LOGFILE_MAXSIZE = 999760; // ログファイル最大サイズ（Byte）
    const LOGFILE_PERIOD = 30; // ログ保存期間（日）

    public function getfileName() {
      $date = date('Ymd');
      return 'consolelog_'.$date;
    }
  }
class Logger {

    // ログレベル
    const LOG_LEVEL_ERROR = 0;
    const LOG_LEVEL_WARN = 1;
    const LOG_LEVEL_INFO = 2;
    const LOG_LEVEL_DEBUG = 3;

    private static $singleton;

    /**
     * インスタンスを生成する
     */
    public static function getInstance()
    {
        if (!isset(self::$singleton)) {
            self::$singleton = new Logger();
        }
        return self::$singleton;
    }

    /**
     * コンストラクタ
     */
    private function __construct() {
    }

    /**
     * ERRORレベルのログ出力する
     * @param string $msg メッセージ
     */
    public function error($msg) {
        if(self::LOG_LEVEL_ERROR <= Config::LOG_LEVEL) {
            $this->out('ERROR', $msg);
        }
    }

    /**
     * WARNレベルのログ出力する
     * @param string $msg メッセージ
     */
    public function warn($msg) {
        if(self::LOG_LEVEL_WARN <= Config::LOG_LEVEL) {
            $this->out('WARN', $msg);
        }
    }

    /**
     * INFOレベルのログ出力する
     * @param string $msg メッセージ
     */
    public function info($msg) {
        if(self::LOG_LEVEL_INFO <= Config::LOG_LEVEL) {
            $this->out('INFO', $msg);
        }
    }

    /**
     * DEBUGレベルのログ出力する
     * @param string $msg メッセージ
     */
    public function debug($msg) {
        if(self::LOG_LEVEL_DEBUG <= Config::LOG_LEVEL) {
            $this->out('DEBUG', $msg);
        }
    }

    /**
     * ログ出力する
     * @param string $level ログレベル
     * @param string $msg メッセージ
     */
    private function out($level, $msg) {
        if(Config::IS_LOGFILE) {

            $pid = getmypid();
            $time = $this->getTime();
            $logMessage = "[{$time}]" . rtrim($msg) . "\n";
            $logFilePath = Config::LOGDIR_PATH . Config::getfileName() . '.log';

            $result = file_put_contents($logFilePath, $logMessage, FILE_APPEND | LOCK_EX);
            if(!$result) {
                error_log('LogUtil::out error_log ERROR', 0);
            }

            if(Config::LOGFILE_MAXSIZE < filesize($logFilePath)) {
                // ファイルサイズを超えた場合、リネームしてgz圧縮する
                $oldPath = Config::LOGDIR_PATH . Config::getfileName() . '_' . date('YmdHis');
                $oldLogFilePath = $oldPath . '.log';
                rename($logFilePath, $oldLogFilePath);
                $gz = gzopen($oldPath . '.gz', 'w9');
                if($gz) {
                    gzwrite($gz, file_get_contents($oldLogFilePath));
                    $isClose = gzclose($gz);
                    if($isClose) {
                        unlink($oldLogFilePath);
                    } else {
                        error_log("gzclose ERROR.", 0);
                    }
                } else {
                    error_log("gzopen ERROR.", 0);
                }

                // 古いログファイルを削除する
                $retentionDate = new DateTime();
                $retentionDate->modify('-' . Config::LOGFILE_PERIOD . ' day');
                if ($dh = opendir(Config::LOGDIR_PATH)) {
                    while (($fileName = readdir($dh)) !== false) {
                        $pm = preg_match("/" . preg_quote(Config::getfileName()) . "_(\d{14}).*\.gz/", $fileName, $matches);
                        if($pm === 1) {
                            $logCreatedDate = DateTime::createFromFormat('YmdHis', $matches[1]);
                            if($logCreatedDate < $retentionDate) {
                                unlink(Config::LOGDIR_PATH . '/' . $fileName);
                            }
                        }
                    }
                    closedir($dh);
                }
            }
        }
    }

    /**
     * 現在時刻を取得する
     * @return string 現在時刻
     */
    private function getTime() {
        $miTime = explode('.',microtime(true));
        $msec = str_pad(substr($miTime[1], 0, 3) , 3, "0");
        $time = date('H:i:s', $miTime[0]) . '.' .$msec;
        return $time;
    }
}


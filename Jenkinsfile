pipeline {
    agent any

    environment {
        APP_SERVER = 'ubuntu@65.0.180.193'
        APP_DIR    = '/var/www/html/q3d'
        GITHUB_REPO = 'https://github.com/Ganesh2306/tq3d.git'
        VERSION    = "1.0.${BUILD_NUMBER}"
    }

    stages {

        // ─────────────────────────────────────────
        // STAGE 1 : GitHub वरून code checkout
        // ─────────────────────────────────────────
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: "${GITHUB_REPO}",
                    credentialsId: 'github-token'

                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    env.FULL_VERSION  = "${VERSION}-${env.GIT_COMMIT_SHORT}"
                    env.VERSIONED_ZIP = "q3d-${env.FULL_VERSION}.zip"
                    echo "========================================="
                    echo " Build Version : ${env.FULL_VERSION}"
                    echo " Package Name  : ${env.VERSIONED_ZIP}"
                    echo " App Server    : ${APP_SERVER}"
                    echo " Deploy Path   : ${APP_DIR}"
                    echo "========================================="
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 2 : Environment verify
        // ─────────────────────────────────────────
        stage('Setup Environment') {
            steps {
                sh '''
                    echo "=== Node Version ==="
                    node -v
                    echo "=== NPM Version ==="
                    npm -v
                '''
            }
        }

        // ─────────────────────────────────────────
        // STAGE 3 : npm install + build
        //   dist/ folder मध्ये output येईल
        // ─────────────────────────────────────────
        stage('Build') {
            steps {
                sh '''
                    npm install
                    npm run build
                '''
            }
        }

        // ─────────────────────────────────────────
        // STAGE 4 : dist/ folder ZIP करा
        //   e.g. q3d-1.0.5-abc1f3d.zip
        // ─────────────────────────────────────────
        stage('Package') {
            steps {
                sh """
                    cd dist
                    zip -r ../${env.VERSIONED_ZIP} .
                    cd ..
                    echo "[OK] Package: ${env.VERSIONED_ZIP} — \$(du -sh ${env.VERSIONED_ZIP} | cut -f1)"
                """
            }
        }

        // ─────────────────────────────────────────
        // STAGE 5 : GitHub वर Git Tag push करा
        //   GitHub → Tags मध्ये version history दिसेल
        // ─────────────────────────────────────────
        stage('Tag Version on GitHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-token',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_TOKEN'
                )]) {
                    sh """
                        git config user.email "jenkins@q3d.ci"
                        git config user.name  "Jenkins CI"

                        git tag -a "${env.FULL_VERSION}" \
                                -m "Release ${env.FULL_VERSION} | Build #${BUILD_NUMBER}"

                        git push https://\${GIT_USER}:\${GIT_TOKEN}@github.com/Ganesh2306/tq3d.git \
                                 "${env.FULL_VERSION}"

                        echo "[OK] Tag ${env.FULL_VERSION} pushed to GitHub"
                    """
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 6 : App Server वर Deploy
        //   A) ZIP → SCP copy to /tmp/
        //   B) Backup जुन्या files
        //   C) नव्या files unzip → APP_DIR
        //   D) Permissions fix
        //   (Service नाही — nginx directly serve करतो)
        // ─────────────────────────────────────────
        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ['app-server-ssh-key']) {

                    // A) ZIP copy
                    sh """
                        scp -o StrictHostKeyChecking=no \
                            ${env.VERSIONED_ZIP} \
                            ${APP_SERVER}:/tmp/${env.VERSIONED_ZIP}
                        echo "[OK] ${env.VERSIONED_ZIP} copied to /tmp/"
                    """

                    // B) Backup + C) Unzip + D) Permissions
                    sh """
                        ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
                            set -e

                            # Directory बनवा जर नसेल तर
                            sudo mkdir -p ${APP_DIR}
                            sudo mkdir -p ${APP_DIR}/backups

                            # B) जुन्या files backup करा
                            BACKUP_DIR="${APP_DIR}/backups/${env.FULL_VERSION}"
                            sudo mkdir -p "\$BACKUP_DIR"
                            sudo find ${APP_DIR} -maxdepth 1 \
                                   -not -name "backups" \
                                   -not -name "CURRENT_VERSION" \
                                   -not -name "." \
                                   -exec cp -r {} "\$BACKUP_DIR/" \\;
                            echo "[OK] Backup: \$BACKUP_DIR"

                            # C) नव्या files unzip करा
                            sudo unzip -o /tmp/${env.VERSIONED_ZIP} -d ${APP_DIR}
                            sudo rm -f /tmp/${env.VERSIONED_ZIP}

                            # D) Permissions fix (nginx साठी)
                            sudo chown -R www-data:www-data ${APP_DIR}
                            sudo chmod -R 755 ${APP_DIR}

                            # Version track करा
                            echo "${env.FULL_VERSION}" | sudo tee ${APP_DIR}/CURRENT_VERSION
                            echo "[OK] Deployed ${env.FULL_VERSION} to ${APP_DIR}"
                        '
                    """
                }
            }
        }

        // ─────────────────────────────────────────
        // STAGE 7 : Health Check
        //   Files exist आहेत का verify करा
        //   Nginx running आहे का check करा
        // ─────────────────────────────────────────
        stage('Health Check') {
            steps {
                sshagent(credentials: ['app-server-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
                            echo "=== Deployed Version ==="
                            cat ${APP_DIR}/CURRENT_VERSION

                            echo "=== Files in Deploy Dir ==="
                            ls -lh ${APP_DIR} | head -10

                            echo "=== Nginx Status ==="
                            systemctl is-active --quiet nginx && \
                            echo "[OK] Nginx is RUNNING" || \
                            echo "[WARN] Nginx is not running — check manually"
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deploy SUCCESS — Version: ${env.FULL_VERSION} — Files live at ${APP_DIR}"
        }
        failure {
            echo "❌ Deploy FAILED — Check console output above"
        }
    }
}

// pipeline {
//     agent any

//     environment {
//         APP_SERVER  = 'ubuntu@65.0.180.193'
//         APP_DIR     = '/var/www/html/q3d'
//         GITHUB_REPO = 'https://github.com/Ganesh2306/tq3d.git'
//         VERSION     = "1.0.${BUILD_NUMBER}"
//         PLUGIN_VER  = "v6.2"   // ← फक्त हे बदल जेव्हा plugin version बदलेल
//     }

//     stages {

//         // ─────────────────────────────────────────
//         // STAGE 1 : GitHub वरून code checkout
//         // ─────────────────────────────────────────
//         stage('Checkout') {
//             steps {
//                 git branch: 'main',
//                     url: "${GITHUB_REPO}",
//                     credentialsId: 'github-token'

//                 script {
//                     env.GIT_COMMIT_SHORT = sh(
//                         script: 'git rev-parse --short HEAD',
//                         returnStdout: true
//                     ).trim()
//                     env.FULL_VERSION  = "${VERSION}-${env.GIT_COMMIT_SHORT}"
//                     env.VERSIONED_ZIP = "q3d-${env.FULL_VERSION}.zip"
//                     echo "========================================="
//                     echo " Build Version : ${env.FULL_VERSION}"
//                     echo " Package Name  : ${env.VERSIONED_ZIP}"
//                     echo " App Server    : ${APP_SERVER}"
//                     echo " Deploy Path   : ${APP_DIR}"
//                     echo "========================================="
//                 }
//             }
//         }

//         // ─────────────────────────────────────────
//         // STAGE 2 : Plugin Version Auto Update
//         //   Plugin Server वरून Tds.min.js चा
//         //   Last-Modified Date fetch करतो
//         //   Query = v6.2_12Feb2026 format बनतो
//         //   login.js मधला Query आपोआप update होतो
//         // ─────────────────────────────────────────
//         stage('Update Plugin Version') {
//             steps {
//                 script {
//                     def date = sh(
//                         script: "curl -sI https://plugin.dam3d.in/q3d/v4/Tds.min.js | grep -i 'last-modified' | awk '{print \$3\$4\$5}' | tr -d ' ,'",
//                         returnStdout: true
//                     ).trim()

//                     def query = "${PLUGIN_VER}_${date}"

//                     echo "========================================="
//                     echo " Plugin Version : ${PLUGIN_VER}"
//                     echo " Plugin Date    : ${date}"
//                     echo " Plugin Query   : ${query}"
//                     echo "========================================="

//                     sh """
//                         sed -i 's|/q3d/v4/Tds.min.js?[^"]*|/q3d/v4/Tds.min.js?${query}|g' src/js/login.js
//                         echo "[OK] login.js → v4/Tds.min.js?${query}"
//                         echo "=== Active Plugin Lines ==="
//                         grep 'Tds.min.js' src/js/login.js | grep -v '//' || true
//                         echo "=========================="
//                     """
//                 }
//             }
//         }

//         // ─────────────────────────────────────────
//         // STAGE 3 : Environment verify
//         // ─────────────────────────────────────────
//         stage('Setup Environment') {
//             steps {
//                 sh '''
//                     echo "=== Node Version ==="
//                     node -v
//                     echo "=== NPM Version ==="
//                     npm -v
//                 '''
//             }
//         }

//         // ─────────────────────────────────────────
//         // STAGE 4 : npm install + build
//         //   dist/ folder मध्ये output येईल
//         // ─────────────────────────────────────────
//         stage('Build') {
//             steps {
//                 sh '''
//                     npm install
//                     npm run build
//                 '''
//             }
//         }

//         // ─────────────────────────────────────────
//         // STAGE 5 : dist/ folder ZIP करा
//         // ─────────────────────────────────────────
//         stage('Package') {
//             steps {
//                 sh """
//                     cd dist
//                     zip -r ../${env.VERSIONED_ZIP} .
//                     cd ..
//                     echo "[OK] Package: ${env.VERSIONED_ZIP} — \$(du -sh ${env.VERSIONED_ZIP} | cut -f1)"
//                 """
//             }
//         }

//         // ─────────────────────────────────────────
//         // STAGE 6 : GitHub वर Git Tag push करा
//         // ─────────────────────────────────────────
//         stage('Tag Version on GitHub') {
//             steps {
//                 withCredentials([usernamePassword(
//                     credentialsId: 'github-token',
//                     usernameVariable: 'GIT_USER',
//                     passwordVariable: 'GIT_TOKEN'
//                 )]) {
//                     sh """
//                         git config user.email "jenkins@q3d.ci"
//                         git config user.name  "Jenkins CI"

//                         git tag -a "${env.FULL_VERSION}" \
//                                 -m "Release ${env.FULL_VERSION} | Build #${BUILD_NUMBER}"

//                         git push https://\${GIT_USER}:\${GIT_TOKEN}@github.com/Ganesh2306/tq3d.git \
//                                  "${env.FULL_VERSION}"

//                         echo "[OK] Tag ${env.FULL_VERSION} pushed to GitHub"
//                     """
//                 }
//             }
//         }

//         // ─────────────────────────────────────────
//         // STAGE 7 : App Server वर Deploy
//         // ─────────────────────────────────────────
//         stage('Deploy to EC2') {
//             steps {
//                 sshagent(credentials: ['app-server-ssh-key']) {

//                     sh """
//                         scp -o StrictHostKeyChecking=no \
//                             ${env.VERSIONED_ZIP} \
//                             ${APP_SERVER}:/tmp/${env.VERSIONED_ZIP}
//                         echo "[OK] ${env.VERSIONED_ZIP} copied to /tmp/"
//                     """

//                     sh """
//                         ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
//                             set -e

//                             sudo mkdir -p ${APP_DIR}
//                             sudo mkdir -p ${APP_DIR}/backups

//                             BACKUP_DIR="${APP_DIR}/backups/${env.FULL_VERSION}"
//                             sudo mkdir -p "\$BACKUP_DIR"
//                             sudo find ${APP_DIR} -maxdepth 1 \
//                                    -not -name "backups" \
//                                    -not -name "CURRENT_VERSION" \
//                                    -not -name "." \
//                                    -not -path "${APP_DIR}" \
//                                    -exec cp -r {} "\$BACKUP_DIR/" \\;
//                             echo "[OK] Backup: \$BACKUP_DIR"

//                             sudo unzip -o /tmp/${env.VERSIONED_ZIP} -d ${APP_DIR}
//                             sudo rm -f /tmp/${env.VERSIONED_ZIP}

//                             sudo chown -R www-data:www-data ${APP_DIR}
//                             sudo chmod -R 755 ${APP_DIR}

//                             echo "${env.FULL_VERSION}" | sudo tee ${APP_DIR}/CURRENT_VERSION
//                             echo "[OK] Deployed ${env.FULL_VERSION} to ${APP_DIR}"
//                         '
//                     """
//                 }
//             }
//         }

//         // ─────────────────────────────────────────
//         // STAGE 8 : Health Check
//         // ─────────────────────────────────────────
//         stage('Health Check') {
//             steps {
//                 sshagent(credentials: ['app-server-ssh-key']) {
//                     sh """
//                         ssh -o StrictHostKeyChecking=no ${APP_SERVER} '
//                             echo "=== Deployed Version ==="
//                             cat ${APP_DIR}/CURRENT_VERSION

//                             echo "=== Files in Deploy Dir ==="
//                             ls -lh ${APP_DIR} | head -10

//                             echo "=== Nginx Status ==="
//                             systemctl is-active --quiet nginx && \
//                             echo "[OK] Nginx is RUNNING" || \
//                             echo "[WARN] Nginx is not running"
//                         '
//                     """
//                 }
//             }
//         }
//     }

//     post {
//         success {
//             echo "✅ Deploy SUCCESS — Version: ${env.FULL_VERSION} — Plugin: ${PLUGIN_VER} — Live at ${APP_DIR}"
//         }
//         failure {
//             echo "❌ Deploy FAILED — Check console output above"
//         }
//     }
// }
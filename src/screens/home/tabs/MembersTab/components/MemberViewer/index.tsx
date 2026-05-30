import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { styles } from './styles';
import { Role, WalletMemberData } from "../../../../../../types/wallet.types";

export type MemberViewerProps = {
    list: [string, WalletMemberData][];
    currentUserRole: Role;
    userId: string;
    colors: any;
    onLeaveWallet: () => void;
    onPromoteMember: (memberId: string, memberName: string) => void;
    onRemoveMember: (memberId: string, memberName: string) => void;
}

export function MemberViewer({ list, currentUserRole, userId, colors, onLeaveWallet, onPromoteMember, onRemoveMember }: MemberViewerProps) {
    const sortedList = [...list].sort((a, b) => a[1].name.localeCompare(b[1].name));

    return (
        <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>MEMBROS DA CARTEIRA</Text>

            {sortedList.map(([memberId, member], index) => {
                const actualMemberId = member.id || memberId;
                const isMe = actualMemberId === userId;
                const isAdmin = member.role === 'admin';

                return (
                    <View key={actualMemberId || `member-${index}`} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.cardContent}>
                            <View style={[styles.avatarContainer, { backgroundColor: isAdmin ? `${colors.primary}15` : `${colors.secondary}15`, overflow: 'hidden' }]}>
                                {member.photoURL ? (
                                    <Image source={{ uri: member.photoURL }} style={{ width: '100%', height: '100%' }} />
                                ) : (
                                    <Ionicons name="person" size={24} color={isAdmin ? colors.primary : colors.secondary} />
                                )}
                            </View>

                            <View style={styles.info}>
                                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                                    {member.name} {isMe ? '(Você)' : ''}
                                </Text>

                                <View style={[styles.roleTag, { backgroundColor: isAdmin ? `${colors.primary}20` : `${colors.secondary}20` }]}>
                                    <Ionicons name={isAdmin ? 'shield-checkmark' : 'eye'} size={12} color={isAdmin ? colors.primary : colors.secondary} />
                                    <Text style={[styles.roleTagText, { color: isAdmin ? colors.primary : colors.secondary }]}>
                                        {isAdmin ? 'Administrador' : 'Visualizador'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {isMe ? (
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: `${colors.error}15` }]}
                                onPress={onLeaveWallet}
                            >
                                <Ionicons name="log-out-outline" size={20} color={colors.error} />
                            </TouchableOpacity>
                        ) : currentUserRole === 'admin' ? (
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                {!isAdmin && (
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: `${colors.primary}15` }]}
                                        onPress={() => onPromoteMember(actualMemberId, member.name)}
                                    >
                                        <Ionicons name="arrow-up-circle-outline" size={20} color={colors.primary} />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: `${colors.error}15` }]}
                                    onPress={() => onRemoveMember(actualMemberId, member.name)}
                                >
                                    <Ionicons name="trash-outline" size={20} color={colors.error} />
                                </TouchableOpacity>
                            </View>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
}
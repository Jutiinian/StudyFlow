import {
	AnimatePresence,
	motion,
	useReducedMotion,
	type Variants,
} from "motion/react";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./PersonaMenu.css";

export interface PersonaMenuItem {
	id: string;
	label: string;
	description: string;
}

interface PersonaMenuProps {
	items: readonly PersonaMenuItem[];
	activeId: string;
	onSelect: (id: string) => void;
}

const snap = [0.15, 0.85, 0.3, 1] as const;
const stars = [
	{ x: "-35vw", y: "-32vh", size: "clamp(4rem, 13vw, 12rem)", angle: -22 },
	{ x: "30vw", y: "-30vh", size: "clamp(3rem, 8vw, 8rem)", angle: 18 },
	{ x: "36vw", y: "24vh", size: "clamp(5rem, 17vw, 15rem)", angle: 35 },
	{ x: "-29vw", y: "32vh", size: "clamp(3rem, 9vw, 8rem)", angle: -15 },
	{ x: "7vw", y: "-38vh", size: "clamp(2rem, 6vw, 6rem)", angle: 12 },
] as const;

/** Reusable modal menu. Items describe real destinations; navigation belongs to the caller. */
export default function PersonaMenu({
	items,
	activeId,
	onSelect,
}: PersonaMenuProps) {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dialogId = useId();

	useEffect(() => {
		function openWithEscape(event: globalThis.KeyboardEvent) {
			const target = event.target;
			const editing =
				target instanceof HTMLElement &&
				(target.isContentEditable ||
					!!target.closest("input, textarea, select, dialog"));
			if (
				event.key === "Escape" &&
				!event.repeat &&
				!event.defaultPrevented &&
				!editing &&
				!open
			) {
				event.preventDefault();
				setOpen(true);
			}
		}
		document.addEventListener("keydown", openWithEscape);
		return () => document.removeEventListener("keydown", openWithEscape);
	}, [open]);

	return (
		<>
			<button
				ref={triggerRef}
				className="p5-menu-trigger"
				type="button"
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-controls={open ? dialogId : undefined}
				onClick={() => setOpen(true)}
			>
				Menu <span aria-hidden="true">↗</span>
			</button>
			{createPortal(
				<AnimatePresence onExitComplete={() => triggerRef.current?.focus()}>
					{open && (
						<MenuOverlay
							key="menu"
							id={dialogId}
							items={items}
							activeId={activeId}
							onClose={() => setOpen(false)}
							onSelect={(id) => {
								onSelect(id);
								setOpen(false);
							}}
						/>
					)}
				</AnimatePresence>,
				document.body,
			)}
		</>
	);
}

interface MenuOverlayProps extends PersonaMenuProps {
	id: string;
	onClose: () => void;
}

function MenuOverlay({
	id,
	items,
	activeId,
	onSelect,
	onClose,
}: MenuOverlayProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const reduceMotion = useReducedMotion();
	const [highlighted, setHighlighted] = useState(activeId);
	const [idlePaused, setIdlePaused] = useState(false);
	const titleId = useId();
	const hintId = useId();
	const selected = items.find((item) => item.id === highlighted) ?? items[0];

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		const previousOverflow = document.body.style.overflow;
		dialog.showModal();
		document.body.style.overflow = "hidden";
		dialog.querySelector<HTMLButtonElement>("[data-current='true']")?.focus();
		return () => {
			dialog.close();
			document.body.style.overflow = previousOverflow;
		};
	}, []);

	const listVariants: Variants = {
		hidden: {},
		visible: {
			transition: {
				delayChildren: reduceMotion ? 0 : 0.48,
				staggerChildren: reduceMotion ? 0 : 0.05,
			},
		},
	};
	const itemVariants: Variants = {
		hidden: (index: number) => ({
			opacity: 0,
			x: reduceMotion ? 0 : index % 2 ? "-65vw" : "65vw",
			y: reduceMotion ? 0 : index % 2 ? "35vh" : "-35vh",
			rotate: reduceMotion ? 0 : index % 2 ? -12 : 12,
			scale: 0.96,
		}),
		visible: {
			opacity: 1,
			x: 0,
			y: 0,
			rotate: 0,
			scale: reduceMotion ? 1 : [0.96, 1.05, 0.99, 1],
			transition: { duration: reduceMotion ? 0 : 0.23, ease: snap },
		},
	};

	function navigateWithKeys(event: KeyboardEvent<HTMLElement>) {
		const buttons = Array.from(
			event.currentTarget.querySelectorAll<HTMLButtonElement>(
				".p5-menu-option",
			),
		);
		const current = buttons.indexOf(
			document.activeElement as HTMLButtonElement,
		);
		let next: number;
		if (event.key === "ArrowDown" || event.key === "ArrowRight")
			next = (current + 1) % buttons.length;
		else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
			next = (current - 1 + buttons.length) % buttons.length;
		else if (event.key === "Home") next = 0;
		else if (event.key === "End") next = buttons.length - 1;
		else return;
		event.preventDefault();
		buttons[next]?.focus();
	}

	return (
		<motion.dialog
			ref={dialogRef}
			id={id}
			className="p5-menu-dialog"
			aria-labelledby={titleId}
			aria-describedby={hintId}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
			initial="hidden"
			animate="visible"
			exit={{
				opacity: 0,
				x: reduceMotion ? 0 : "-5vw",
				y: reduceMotion ? 0 : "5vh",
				transition: { duration: reduceMotion ? 0 : 0.14 },
			}}
			data-idle={!reduceMotion && !idlePaused ? "on" : "off"}
		>
			<div className="p5-menu-art" aria-hidden="true">
				<motion.div
					className="p5-menu-slash p5-menu-slash-red"
					variants={{
						hidden: {
							x: reduceMotion ? 0 : "110vw",
							y: reduceMotion ? 0 : "-80vh",
							rotate: -12,
						},
						visible: {
							x: 0,
							y: 0,
							rotate: 0,
							transition: { duration: reduceMotion ? 0 : 0.15, ease: snap },
						},
					}}
				/>
				<motion.div
					className="p5-menu-slash p5-menu-slash-black"
					variants={{
						hidden: {
							x: reduceMotion ? 0 : "-110vw",
							y: reduceMotion ? 0 : "60vh",
							rotate: 9,
						},
						visible: {
							x: 0,
							y: 0,
							rotate: 0,
							transition: {
								delay: reduceMotion ? 0 : 0.08,
								duration: reduceMotion ? 0 : 0.15,
								ease: snap,
							},
						},
					}}
				/>
				{stars.map((star, index) => (
					<motion.svg
						key={index}
						className={`p5-menu-star p5-menu-star-${index % 2}`}
						viewBox="0 0 100 100"
						style={{ width: star.size }}
						variants={{
							hidden: { x: 0, y: 0, scale: 0, rotate: -60, opacity: 0 },
							visible: {
								x: star.x,
								y: star.y,
								scale: reduceMotion ? 1 : [0, 1.18, 1],
								rotate: star.angle,
								opacity: 1,
								transition: {
									delay: reduceMotion ? 0 : 0.23 + index * 0.012,
									duration: reduceMotion ? 0 : 0.2,
									ease: "easeOut",
								},
							},
						}}
					>
						<path d="M50 3 60 35 96 27 73 53 94 85 58 72 39 98 36 64 3 54 34 39Z" />
					</motion.svg>
				))}
			</div>
			<motion.div
				className="p5-menu-content"
				variants={{
					hidden: { opacity: 0 },
					visible: {
						opacity: 1,
						transition: {
							delay: reduceMotion ? 0 : 0.23,
							duration: reduceMotion ? 0 : 0.06,
						},
					},
				}}
			>
				<div className="p5-menu-topbar">
					<h2 id={titleId}>
						<span>COMMAND</span> <span>MENU</span>
					</h2>
					<button type="button" className="p5-menu-close" onClick={onClose}>
						Close <kbd>Esc</kbd>
					</button>
				</div>
				<div className="p5-menu-composition">
					<motion.nav
						className="p5-menu-options"
						aria-label="Choose your destination"
						variants={listVariants}
						onKeyDown={navigateWithKeys}
					>
						{items.map((item, index) => (
							<motion.div
								key={item.id}
								custom={index}
								variants={itemVariants}
								className="p5-menu-item"
							>
								<button
									type="button"
									className="p5-menu-option"
									data-current={item.id === activeId}
									data-selected={item.id === highlighted}
									aria-current={item.id === activeId ? "page" : undefined}
									onPointerEnter={() => setHighlighted(item.id)}
									onFocus={() => setHighlighted(item.id)}
									onClick={() => onSelect(item.id)}
								>
									<span className="p5-menu-item-number" aria-hidden="true">
										0{index + 1}
									</span>
									<span className="p5-menu-item-label">{item.label}</span>
									<span className="p5-menu-item-arrow" aria-hidden="true">
										↗
									</span>
								</button>
							</motion.div>
						))}
					</motion.nav>
					<div className="p5-menu-poster" aria-hidden="true">
						<span>TAKE</span>
						<span>YOUR</span>
						<span>TIME.</span>
						<b>★</b>
					</div>
				</div>
				<div className="p5-menu-bottom">
					<p key={selected?.id} id={hintId} className="p5-menu-description">
						<strong>Your next move</strong>
						{selected?.description ?? "Choose a destination."}
					</p>
					<button
						type="button"
						className="p5-menu-idle-toggle"
						aria-pressed={idlePaused || !!reduceMotion}
						disabled={!!reduceMotion}
						onClick={() => setIdlePaused(!idlePaused)}
					>
						{reduceMotion
							? "Reduced motion"
							: idlePaused
								? "Resume effects"
								: "Pause idle effects"}
					</button>
				</div>
			</motion.div>
		</motion.dialog>
	);
}
